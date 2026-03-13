package city.pulse.auth.feature.oauth2.service;

import city.pulse.auth.feature.dto.AuthResponse;
import city.pulse.auth.feature.oauth2.dto.OAuth2CompleteRegistrationRequest;
import city.pulse.auth.feature.oauth2.dto.OAuth2LoginRequest;
import city.pulse.auth.feature.oauth2.provider.OAuth2Provider;

public interface OAuth2AuthService {
    AuthResponse loginWithOAuth2(OAuth2Provider provider, OAuth2LoginRequest dto);
    AuthResponse completeOAuth2Registration(OAuth2Provider provider, OAuth2CompleteRegistrationRequest dto);
}