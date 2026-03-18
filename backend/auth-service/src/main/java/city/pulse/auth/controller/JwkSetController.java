package city.pulse.auth.controller;

import city.pulse.auth.security.jwt.JwtKeyConfig;
import com.nimbusds.jose.jwk.JWKSet;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("${app.base-path}")
public class JwkSetController {
    private final JwtKeyConfig config;

    @GetMapping("/.well-known/jwks.json")
    public Map<String, Object> getJwkSet() {
        return new JWKSet(config.getAllPublicKeys()).toJSONObject();
    }
}