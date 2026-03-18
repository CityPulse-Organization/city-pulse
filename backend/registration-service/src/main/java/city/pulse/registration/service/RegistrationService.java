package city.pulse.registration.service;

import city.pulse.registration.dto.LocalRegistrationRequest;
import city.pulse.registration.dto.OAuth2RegistrationRequest;
import city.pulse.registration.dto.RegistrationResponse;
import org.springframework.security.oauth2.jwt.Jwt;

public interface RegistrationService {
    RegistrationResponse registerLocalUser(LocalRegistrationRequest dto);

    RegistrationResponse registerOAuth2User(OAuth2RegistrationRequest dto, Jwt jwt);
}
