package city.pulse.registration.service;

import city.pulse.registration.dto.LocalRegistrationRequest;
import city.pulse.registration.dto.OAuth2RegistrationRequest;
import org.springframework.security.oauth2.jwt.Jwt;

public interface RegistrationService {
    void registerLocalUser(LocalRegistrationRequest dto);

    void registerOAuth2User(OAuth2RegistrationRequest dto, Jwt jwt);
}
