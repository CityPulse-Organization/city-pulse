package city.pulse.auth.oauth2.service;

import city.pulse.auth.oauth2.dto.OAuth2LoginRequest;
import city.pulse.auth.oauth2.dto.OAuth2LoginResult;
import city.pulse.auth.model.AuthProvider;

public interface OAuth2AuthService {
    OAuth2LoginResult loginWithOAuth2(AuthProvider provider, OAuth2LoginRequest dto);
}