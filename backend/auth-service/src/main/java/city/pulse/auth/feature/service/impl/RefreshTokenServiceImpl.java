package city.pulse.auth.feature.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import city.pulse.auth.feature.security.jwt.JwtConfig;
import city.pulse.auth.feature.exception.InvalidTokenException;
import city.pulse.auth.feature.model.RefreshToken;
import city.pulse.auth.feature.repository.RefreshTokenRepository;
import city.pulse.auth.feature.util.Tokens;
import city.pulse.auth.feature.service.RefreshTokenService;
import city.pulse.auth.feature.model.User;

import java.time.Instant;

@Service
@Transactional
@RequiredArgsConstructor
public class RefreshTokenServiceImpl implements RefreshTokenService {
    private final RefreshTokenRepository repository;
    private final JwtConfig config;

    @Override
    public String issue(User user) {
        var raw = Tokens.randomToken(32);
        var hash = Tokens.sha256(raw);

        var now = Instant.now();
        var expiresAt = now.plusMillis(config.getRefreshTokenTtlMs());

        var refreshToken = RefreshToken.builder()
                .user(user)
                .tokenHash(hash)
                .issuedAt(now)
                .expiresAt(expiresAt)
                .build();

        repository.save(refreshToken);
        return raw;
    }

    @Override
    @Transactional(readOnly = true)
    public RefreshToken validateActive(String raw) {
        return repository.findActiveByHash(
                Tokens.sha256(raw),
                Instant.now()).orElseThrow(InvalidTokenException::new
        );
    }

    @Override
    public String rotate(RefreshToken oldToken) {
        oldToken.revoke();
        return issue(oldToken.getUser());
    }

    @Override
    public void revokeById(Long id) {
        repository.revokeById(id);
    }
}
