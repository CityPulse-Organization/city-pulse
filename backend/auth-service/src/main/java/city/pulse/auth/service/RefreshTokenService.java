package city.pulse.auth.service;

import city.pulse.auth.model.Credential;
import city.pulse.auth.model.RefreshToken;

public interface RefreshTokenService {
    String issue(Credential credential);
    RefreshToken validateActive(String rawToken);
    String rotate(RefreshToken oldToken);
    void revokeById(Long id);
}
