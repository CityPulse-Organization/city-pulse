package city.pulse.auth.feature.service;

import city.pulse.auth.feature.dto.AuthResponse;
import city.pulse.auth.feature.model.User;

public interface AuthTokenService {
    AuthResponse generateTokenPair(User user);
    AuthResponse rotateToken(String refreshToken);
    void revokeToken(String refreshToken);
}
