package city.pulse.auth.feature.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;
import city.pulse.auth.feature.security.jwt.JwtConfig;
import city.pulse.auth.feature.service.JwtService;
import city.pulse.auth.feature.model.Role;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class JwtServiceImpl implements JwtService {
    private final JwtEncoder encoder;
    private final JwtConfig config;

    @Override
    public String createAccessToken(Long userId, Role role) {
        var now = Instant.now();
        var claims = JwtClaimsSet.builder()
                .issuer(config.getIss())
                .subject(userId.toString())
                .issuedAt(now)
                .expiresAt(now.plusMillis(config.getAccessTokenTtlMs()))
                .claim("role", role)
                .build();

        return encoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();
    }
}