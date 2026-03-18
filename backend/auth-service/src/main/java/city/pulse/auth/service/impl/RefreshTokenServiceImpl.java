package city.pulse.auth.service.impl;

import city.pulse.auth.exception.InvalidRefreshTokenException;
import city.pulse.auth.model.Credential;
import city.pulse.auth.model.RefreshToken;
import city.pulse.auth.repository.RefreshTokenRepository;
import city.pulse.auth.security.jwt.JwtProperties;
import city.pulse.auth.service.RefreshTokenService;
import city.pulse.auth.util.Tokens;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Service
@Transactional
@RequiredArgsConstructor
public class RefreshTokenServiceImpl implements RefreshTokenService {
    private final RefreshTokenRepository repository;
    private final JwtProperties properties;

    @Override
    public String issue(Credential credential) {
        var raw = Tokens.randomToken(32);
        var hash = Tokens.sha256(raw);

        var refreshToken = RefreshToken.build(credential, hash, properties.getTtl().getRefreshTokenTtl());

        repository.save(refreshToken);
        return raw;
    }

    @Override
    @Transactional(readOnly = true)
    public RefreshToken validateActive(String raw) {
        return repository.findActiveByHash(
                Tokens.sha256(raw),
                Instant.now()
        ).orElseThrow(InvalidRefreshTokenException::new);
    }

    @Override
    public String rotate(RefreshToken oldToken) {
        oldToken.revoke();
        return issue(oldToken.getCredential());
    }

    @Override
    public void revokeById(Long id) {
        repository.revokeById(id);
    }
}
