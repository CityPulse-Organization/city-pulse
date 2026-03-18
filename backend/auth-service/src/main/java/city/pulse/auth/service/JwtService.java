package city.pulse.auth.service;

import city.pulse.auth.model.AuthProvider;
import city.pulse.auth.model.Role;

import java.util.UUID;

public interface JwtService {
    String createAccessToken(UUID userId, Role role);
    String createTemporaryToken(String email, AuthProvider provider, String providerId);
}
