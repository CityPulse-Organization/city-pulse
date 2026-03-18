package city.pulse.auth.service.impl;

import city.pulse.auth.dto.AuthResponse;
import city.pulse.auth.model.AuthProvider;
import city.pulse.auth.model.Credential;
import city.pulse.auth.service.AuthTokenService;
import city.pulse.auth.service.JwtService;
import city.pulse.auth.service.RefreshTokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class AuthTokenServiceImpl implements AuthTokenService {
    private final RefreshTokenService refreshTokenService;
    private final JwtService jwtService;

    @Override
    public AuthResponse generateTokenPair(Credential credential) {
        var access = jwtService.createAccessToken(credential.getId(), credential.getRole());
        var refresh = refreshTokenService.issue(credential);

        return new AuthResponse(access, refresh);
    }

    @Override
    public String generateTemporaryToken(String email, AuthProvider provider, String providerId) {
        return jwtService.createTemporaryToken(email, provider, providerId);
    }

    @Override
    public AuthResponse rotateToken(String refreshToken) {
        var token = refreshTokenService.validateActive(refreshToken);
        var user = token.getCredential();

        var newAccess = jwtService.createAccessToken(user.getId(), user.getRole());
        var newRefresh = refreshTokenService.rotate(token);

        return new AuthResponse(newAccess, newRefresh);
    }

    @Override
    public void revokeToken(String refreshToken) {
        var token = refreshTokenService.validateActive(refreshToken);
        refreshTokenService.revokeById(token.getId());
    }
}