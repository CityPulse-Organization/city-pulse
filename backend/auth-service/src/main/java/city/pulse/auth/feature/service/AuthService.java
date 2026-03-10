package city.pulse.auth.feature.service;

import city.pulse.auth.feature.dto.*;
import city.pulse.auth.feature.oauth2.dto.OAuth2CompleteRegistrationRequest;
import city.pulse.auth.feature.oauth2.dto.OAuth2LoginRequest;
import city.pulse.auth.feature.oauth2.provider.OAuth2Provider;

public interface AuthService {
    AuthResponse login(AuthRequest dto);
    AuthResponse refresh(RefreshTokenRequest dto);
    void logout(RefreshTokenRequest dto);
    RegistrationResponse createUser(RegistrationRequest dto);
    AuthResponse loginWithOAuth2(OAuth2Provider provider, OAuth2LoginRequest dto);
    AuthResponse completeOAuth2Registration(OAuth2Provider provider, OAuth2CompleteRegistrationRequest dto);
}
