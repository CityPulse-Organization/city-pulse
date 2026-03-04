package city.pulse.auth.feature.service;

import city.pulse.auth.feature.dto.*;

public interface AuthService {
    AuthResponse login(AuthRequest dto);
    AuthResponse refresh(RefreshTokenRequest dto);
    void logout(RefreshTokenRequest dto);
    RegistrationResponse createUser(RegistrationRequest dto);
}
