package city.pulse.auth.feature.oauth2.service.impl;

import city.pulse.auth.feature.dto.AuthResponse;
import city.pulse.auth.feature.exception.UserNotFoundException;
import city.pulse.auth.feature.oauth2.dto.OAuth2CompleteRegistrationRequest;
import city.pulse.auth.feature.oauth2.dto.OAuth2LoginRequest;
import city.pulse.auth.feature.oauth2.exception.OAuth2RegistrationRequiredException;
import city.pulse.auth.feature.oauth2.factory.OAuth2StrategyFactory;
import city.pulse.auth.feature.oauth2.provider.OAuth2Provider;
import city.pulse.auth.feature.oauth2.service.OAuth2AuthService;
import city.pulse.auth.feature.service.AuthTokenService;
import city.pulse.auth.feature.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class OAuth2AuthServiceImpl implements OAuth2AuthService {
    private final AuthTokenService authTokenService;
    private final OAuth2StrategyFactory factory;
    private final UserService userService;

    @Override
    @Transactional
    public AuthResponse loginWithOAuth2(OAuth2Provider provider, OAuth2LoginRequest dto) {
        var userInfo = factory.getStrategy(provider).validateAndExtract(dto.token());

        try {
            var user = userService.findByEmail(userInfo.email());
            return authTokenService.generateTokenPair(user);
        } catch (UserNotFoundException e) {
            throw new OAuth2RegistrationRequiredException(userInfo.email(), provider);
        }
    }

    @Override
    @Transactional
    public AuthResponse completeOAuth2Registration(OAuth2Provider provider, OAuth2CompleteRegistrationRequest dto) {
        var userInfo = factory.getStrategy(provider).validateAndExtract(dto.token());
        var user = userService.register(userInfo, dto);

        return authTokenService.generateTokenPair(user);
    }
}