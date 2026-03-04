package city.pulse.auth.feature.controller;

import com.nimbusds.jose.jwk.JWKSet;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import city.pulse.auth.feature.security.jwt.JwtConfig;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("${app.base-path}/auth/.well-known/jwks.json")
public class JwkSetController {
    private final JwtConfig config;

    @GetMapping
    public Map<String, Object> getJwkSet() {
        return new JWKSet(config.getRsaKeyWithPublicKey()).toJSONObject();
    }
}