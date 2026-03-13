package city.pulse.auth.feature.service;

import city.pulse.auth.feature.dto.RegistrationRequest;
import city.pulse.auth.feature.model.User;
import city.pulse.auth.feature.oauth2.dto.OAuth2CompleteRegistrationRequest;
import city.pulse.auth.feature.oauth2.dto.OAuth2UserInfo;

public interface UserService {
    User findById(Long id);
    User findByEmail(String email);
    User findByUsername(String username);
    User register(OAuth2UserInfo userInfo, OAuth2CompleteRegistrationRequest dto);
    User register(RegistrationRequest dto);
}
