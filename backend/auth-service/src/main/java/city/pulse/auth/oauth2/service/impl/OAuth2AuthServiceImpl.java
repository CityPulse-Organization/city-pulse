package city.pulse.auth.oauth2.service.impl;

import city.pulse.auth.model.LinkedAccount;
import city.pulse.auth.oauth2.dto.OAuth2LoginRequest;
import city.pulse.auth.oauth2.dto.OAuth2LoginResult;
import city.pulse.auth.oauth2.factory.OAuth2StrategyFactory;
import city.pulse.auth.model.AuthProvider;
import city.pulse.auth.oauth2.service.OAuth2AuthService;
import city.pulse.auth.repository.CredentialRepository;
import city.pulse.auth.repository.LinkedAccountRepository;
import city.pulse.auth.service.AuthTokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class OAuth2AuthServiceImpl implements OAuth2AuthService {
    private final LinkedAccountRepository linkedAccountRepository;
    private final CredentialRepository credentialRepository;
    private final OAuth2StrategyFactory factory;
    private final AuthTokenService service;

    @Override
    @Transactional
    public OAuth2LoginResult loginWithOAuth2(AuthProvider provider, OAuth2LoginRequest dto) {
        var strategy = factory.getStrategy(provider);
        var userInfo = strategy.validateAndExtract(dto.idToken());

        return linkedAccountRepository.findByProviderAndProviderId(provider, userInfo.providerId())
                .map(LinkedAccount::getCredential)
                .or(() -> credentialRepository.findByEmail(userInfo.email())
                        .map(existingUser -> {
                            var newLink = LinkedAccount.builder()
                                    .credential(existingUser)
                                    .provider(provider)
                                    .providerId(userInfo.providerId())
                                    .build();
                            linkedAccountRepository.save(newLink);
                            return existingUser;
                        })
                )
                .map(credential -> {
                    var tokens = service.generateTokenPair(credential);
                    return OAuth2LoginResult.success(tokens);
                })
                .orElseGet(() -> {
                    var temporaryToken = service.generateTemporaryToken(userInfo.email(), userInfo.providerId());
                    return OAuth2LoginResult.registrationRequired(temporaryToken);
                });
    }
}