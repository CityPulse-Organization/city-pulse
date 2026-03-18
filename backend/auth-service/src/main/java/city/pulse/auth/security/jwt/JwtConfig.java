package city.pulse.auth.security.jwt;

import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.source.ImmutableJWKSet;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;

import java.security.interfaces.RSAPublicKey;

@Configuration
@RequiredArgsConstructor
public class JwtConfig {
    private final JwtProperties properties;

    @Bean
    public JwtEncoder jwtEncoder(JwtKeyConfig keyConfig) {
        var signingKey = keyConfig.getSigningKey();
        var jwkSet = new JWKSet(signingKey);
        return new NimbusJwtEncoder(new ImmutableJWKSet<>(jwkSet));
    }

    @Bean
    public JwtDecoder jwtDecoder(RSAPublicKey publicKey) {
        var decoder = NimbusJwtDecoder.withPublicKey(publicKey).build();
        decoder.setJwtValidator(JwtValidators.createDefaultWithIssuer(properties.getIss()));
        return decoder;
    }

    @Bean
    public JwtGrantedAuthoritiesConverter jwtGrantedAuthoritiesConverter() {
        var authoritiesConverter = new JwtGrantedAuthoritiesConverter();
        authoritiesConverter.setAuthoritiesClaimName("role");
        authoritiesConverter.setAuthorityPrefix("ROLE_");
        return authoritiesConverter;
    }

    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter(JwtGrantedAuthoritiesConverter authoritiesConverter) {
        var converter = new JwtAuthenticationConverter();
        converter.setJwtGrantedAuthoritiesConverter(authoritiesConverter);
        return converter;
    }
}