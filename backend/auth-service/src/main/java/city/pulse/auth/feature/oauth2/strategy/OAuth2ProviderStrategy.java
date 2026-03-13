package city.pulse.auth.feature.oauth2.strategy;

import city.pulse.auth.feature.oauth2.dto.OAuth2UserInfo;
import city.pulse.auth.feature.oauth2.provider.OAuth2Provider;

public interface OAuth2ProviderStrategy {
    OAuth2Provider getProvider();
    OAuth2UserInfo validateAndExtract(String token);
}