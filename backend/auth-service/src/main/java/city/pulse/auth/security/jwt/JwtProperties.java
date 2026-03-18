package city.pulse.auth.security.jwt;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

@Getter
@Setter
@Configuration
@ConfigurationProperties(prefix = "app.security.jwt")
public class JwtProperties {
    private String iss;
    private String activeKeyId;
    private Ttl ttl;
    private Map<String, JwtKeyConfig.KeyPaths> rotation = new HashMap<>();

    @Getter
    @Setter
    public static class Ttl {
        private Duration accessTokenTtl;
        private Duration refreshTokenTtl;
        private Duration temporaryTokenTtl;
    }
}