package city.pulse.auth.service;

import city.pulse.auth.dto.AuthRequest;
import city.pulse.auth.dto.AuthResponse;
import city.pulse.auth.dto.RefreshRequest;
import city.pulse.auth.dto.internal.InternalLocalRegistrationRequest;
import city.pulse.auth.dto.internal.InternalOAuth2RegistrationRequest;

import java.util.UUID;

public interface AuthService {
    AuthResponse login(AuthRequest dto);

    AuthResponse refresh(RefreshRequest dto);

    void logout(RefreshRequest dto);

    UUID createLocalCredential(InternalLocalRegistrationRequest dto);

    UUID createOAuth2Credential(InternalOAuth2RegistrationRequest dto);

    void deleteCredentials(UUID id);
}
