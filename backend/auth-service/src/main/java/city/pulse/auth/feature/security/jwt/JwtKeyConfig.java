package city.pulse.auth.feature.security.jwt;

import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.security.KeyFactory;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;

@Slf4j
@Getter
@Setter
@Configuration
@ConfigurationProperties(prefix = "app.jwt.keys")
public class JwtKeyConfig {
    private String privateKeyPath;
    private String publicKeyPath;

    private KeyPair generatedKeyPair;

    @Bean
    public RSAPrivateKey privateKey() {
        try {
            return (RSAPrivateKey) readKey(privateKeyPath, true);
        } catch (Exception e) {
            log.warn("Could not read private key from {}. Using in-memory fallback.", privateKeyPath);
            return (RSAPrivateKey) getOrCreateKeyPair().getPrivate();
        }
    }

    @Bean
    public RSAPublicKey publicKey() {
        try {
            return (RSAPublicKey) readKey(publicKeyPath, false);
        } catch (Exception e) {
            log.warn("Could not read public key from {}. Using in-memory fallback.", publicKeyPath);
            return (RSAPublicKey) getOrCreateKeyPair().getPublic();
        }
    }

    private Object readKey(String path, boolean isPrivate) throws Exception {
        if (path == null) {
            throw new IllegalArgumentException("Key path is null");
        }

        try (var inputStream = getClass().getResourceAsStream(path.replace("classpath:", "/"))) {
            if (inputStream == null) {
                throw new IllegalArgumentException("Key file not found: " + path);
            }

            var key = new String(inputStream.readAllBytes())
                    .replaceAll("-----\\w+ (PRIVATE|PUBLIC) KEY-----", "")
                    .replaceAll("\\s", "");

            var decoded = Base64.getDecoder().decode(key);
            var kf = KeyFactory.getInstance("RSA");

            return isPrivate
                    ? kf.generatePrivate(new PKCS8EncodedKeySpec(decoded))
                    : kf.generatePublic(new X509EncodedKeySpec(decoded));
        }
    }

    private synchronized KeyPair getOrCreateKeyPair() {
        if (this.generatedKeyPair == null) {
            try {
                KeyPairGenerator keyPairGenerator = KeyPairGenerator.getInstance("RSA");
                keyPairGenerator.initialize(2048);
                this.generatedKeyPair = keyPairGenerator.generateKeyPair();
                log.info("Successfully generated in-memory RSA KeyPair for local development.");
            } catch (Exception e) {
                throw new IllegalStateException("Failed to generate RSA keys", e);
            }
        }
        return this.generatedKeyPair;
    }
}