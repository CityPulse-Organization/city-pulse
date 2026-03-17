package city.pulse.auth.service;

import city.pulse.auth.dto.AuthResponse;
import city.pulse.auth.model.Credential;

public interface AuthTokenService {
    AuthResponse generateTokenPair(Credential credential);
    AuthResponse rotateToken(String refreshToken);
    String generateTemporaryToken(String email, String providerId);
    void revokeToken(String refreshToken);
}
