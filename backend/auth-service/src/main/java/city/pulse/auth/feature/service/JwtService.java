package city.pulse.auth.feature.service;

import city.pulse.auth.feature.model.Role;

public interface JwtService {
    String createAccessToken(Long userId, Role role);
}
