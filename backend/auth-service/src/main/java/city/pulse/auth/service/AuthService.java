package city.pulse.auth.service;

import city.pulse.auth.dto.*;

import java.util.UUID;

public interface AuthService {
    AuthResponse login(AuthRequest dto);
    AuthResponse refresh(RefreshRequest dto);
    void logout(RefreshRequest dto);
    UUID registerUser(InternalRegistrationRequest dto);
}
