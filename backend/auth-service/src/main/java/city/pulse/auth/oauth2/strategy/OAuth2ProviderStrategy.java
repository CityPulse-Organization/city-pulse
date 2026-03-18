package city.pulse.auth.oauth2.strategy;

import city.pulse.auth.model.AuthProvider;
import city.pulse.auth.oauth2.dto.OAuth2UserInfo;

public interface OAuth2ProviderStrategy {
    AuthProvider getProvider();

    OAuth2UserInfo validateAndExtract(String token);
}
