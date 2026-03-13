package city.pulse.auth.feature.service.impl;

import city.pulse.auth.feature.dto.AuthResponse;
import city.pulse.auth.feature.model.User;
import city.pulse.auth.feature.service.AuthTokenService;
import city.pulse.auth.feature.service.JwtService;
import city.pulse.auth.feature.service.RefreshTokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthTokenServiceImpl implements AuthTokenService {
    private final RefreshTokenService refreshTokenService;
    private final JwtService jwtService;

    @Override
    @Transactional
    public AuthResponse generateTokenPair(User user) {
        var access = jwtService.createAccessToken(user.getId(), user.getRole());
        var refresh = refreshTokenService.issue(user);
        return new AuthResponse(access, refresh);
    }

    @Override
    @Transactional
    public AuthResponse rotateToken(String refreshToken) {
        var token = refreshTokenService.validateActive(refreshToken);
        var user = token.getUser();

        var newAccess = jwtService.createAccessToken(user.getId(), user.getRole());
        var newRefresh = refreshTokenService.rotate(token);

        return new AuthResponse(newAccess, newRefresh);
    }

    @Override
    @Transactional
    public void revokeToken(String refreshToken) {
        var token = refreshTokenService.validateActive(refreshToken);
        refreshTokenService.revokeById(token.getId());
    }
}