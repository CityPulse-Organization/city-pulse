package city.pulse.auth.feature.service;

import city.pulse.auth.feature.model.RefreshToken;
import city.pulse.auth.feature.model.User;

public interface RefreshTokenService {
    String issue(User user);
    RefreshToken validateActive(String rawToken);
    String rotate(RefreshToken oldToken);
    void revokeById(Long id);
}
