package city.pulse.auth.service.impl;

import city.pulse.auth.model.AuthProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;
import city.pulse.auth.security.jwt.JwtProperties;
import city.pulse.auth.service.JwtService;
import city.pulse.auth.model.Role;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class JwtServiceImpl implements JwtService {
    private final JwtProperties properties;
    private final JwtEncoder encoder;

    @Override
    public String createAccessToken(UUID userId, Role role) {
        var now = Instant.now();
        var claims = JwtClaimsSet.builder()
                .issuer(properties.getIss())
                .subject(userId.toString())
                .issuedAt(now)
                .expiresAt(now.plus(properties.getTtl().getAccessTokenTtl()))
                .claim("role", role.name())
                .claim("scope", "access")
                .build();

        return encoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();
    }

    @Override
    public String createTemporaryToken(String email, AuthProvider provider, String providerId) {
        var now = Instant.now();
        var claims = JwtClaimsSet.builder()
                .issuer(properties.getIss())
                .subject(email)
                .issuedAt(now)
                .expiresAt(now.plus(properties.getTtl().getTemporaryTokenTtl()))
                .claim("provider", provider)
                .claim("provider_id", providerId)
                .claim("scope", "registration")
                .build();

        return encoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();
    }
}