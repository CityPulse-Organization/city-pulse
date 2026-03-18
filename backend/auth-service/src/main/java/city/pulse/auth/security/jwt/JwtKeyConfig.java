package city.pulse.auth.security.jwt;

import com.nimbusds.jose.jwk.JWK;
import com.nimbusds.jose.jwk.RSAKey;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.core.io.ResourceLoader;
import org.springframework.util.FileCopyUtils;

import java.nio.charset.StandardCharsets;
import java.security.KeyFactory;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Arrays;
import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Getter
@Setter
@Configuration
@RequiredArgsConstructor
public class JwtKeyConfig {
    private final JwtProperties properties;
    private final Environment environment;
    private final ResourceLoader resourceLoader;

    private KeyPair generatedKeyPair;

    @Getter
    @Setter
    public static class KeyPaths {
        private String privateKeyPath;
        private String publicKeyPath;
    }

    public List<JWK> getAllPublicKeys() {
        var rotation = properties.getRotation();
        if (rotation.isEmpty() && !isProd()) {
            var kp = getOrCreateKeyPair();
            return List.of(
                    new RSAKey.Builder((RSAPublicKey) kp.getPublic())
                            .keyID(properties.getActiveKeyId())
                            .build()
            );
        }

        return rotation.entrySet().stream()
                .map(entry -> {
                    RSAPublicKey pub = loadPublicKey(entry.getKey(), entry.getValue().getPublicKeyPath());
                    return new RSAKey.Builder(pub).keyID(entry.getKey()).build();
                })
                .collect(Collectors.toList());
    }

    public JWK getSigningKey() {
        return new RSAKey.Builder(publicKey())
                .privateKey(privateKey())
                .keyID(properties.getActiveKeyId())
                .build();
    }

    @Bean
    public RSAPrivateKey privateKey() {
        var paths = properties.getRotation().get(properties.getActiveKeyId());
        if (paths == null) {
            return handleKeyFailure("Active key ID not found in rotation", true, RSAPrivateKey.class);
        }
        return loadPrivateKey(properties.getActiveKeyId(), paths.getPrivateKeyPath());
    }

    @Bean
    public RSAPublicKey publicKey() {
        var paths = properties.getRotation().get(properties.getActiveKeyId());
        if (paths == null) {
            return handleKeyFailure("Active key ID not found in rotation", false, RSAPublicKey.class);
        }
        return loadPublicKey(properties.getActiveKeyId(), paths.getPublicKeyPath());
    }

    private RSAPrivateKey loadPrivateKey(String kid, String path) {
        try {
            return (RSAPrivateKey) readKey(path, true);
        } catch (Exception e) {
            return handleKeyFailure("Failed to load private key [" + kid + "] from " + path, true, RSAPrivateKey.class);
        }
    }

    private RSAPublicKey loadPublicKey(String kid, String path) {
        try {
            return (RSAPublicKey) readKey(path, false);
        } catch (Exception e) {
            return handleKeyFailure("Failed to load public key [" + kid + "] from " + path, false, RSAPublicKey.class);
        }
    }

    private Object readKey(String path, boolean isPrivate) throws Exception {
        var resource = resourceLoader.getResource(path);
        byte[] keyBytes = FileCopyUtils.copyToByteArray(resource.getInputStream());

        var key = new String(keyBytes, StandardCharsets.UTF_8)
                .replaceAll("-----\\w+ (PRIVATE|PUBLIC) KEY-----", "")
                .replaceAll("\\s", "");

        var decoded = Base64.getDecoder().decode(key);
        var kf = KeyFactory.getInstance("RSA");

        return isPrivate
                ? kf.generatePrivate(new PKCS8EncodedKeySpec(decoded))
                : kf.generatePublic(new X509EncodedKeySpec(decoded));
    }

    private boolean isProd() {
        return Arrays.asList(environment.getActiveProfiles()).contains("prod");
    }

    private <T> T handleKeyFailure(String message, boolean isPrivate, Class<T> type) {
        if (isProd()) {
            log.error("CRITICAL: {}", message);
            throw new IllegalStateException("Production keys missing! " + message);
        }

        log.warn("{}. Using in-memory fallback (DEV mode).", message);
        var kp = getOrCreateKeyPair();
        var key = isPrivate ? kp.getPrivate() : kp.getPublic();

        return type.cast(key);
    }

    private synchronized KeyPair getOrCreateKeyPair() {
        if (this.generatedKeyPair == null) {
            try {
                KeyPairGenerator gen = KeyPairGenerator.getInstance("RSA");
                gen.initialize(2048);
                this.generatedKeyPair = gen.generateKeyPair();
                log.info("Generated ephemeral RSA keys for development.");
            } catch (Exception e) {
                throw new IllegalStateException(e);
            }
        }
        return this.generatedKeyPair;
    }
}
