package city.pulse.auth.feature.service;

import city.pulse.auth.feature.model.User;
import city.pulse.auth.feature.oauth2.dto.OAuth2CompleteRegistrationRequest;
import city.pulse.auth.feature.oauth2.dto.OAuth2UserInfo;

public interface UserService {
    User findUserById(Long id);
    User findUserByEmail(String email);
    User findUserByUsername(String username);
    User registerOAuth2User(OAuth2UserInfo userInfo, OAuth2CompleteRegistrationRequest dto);
}
