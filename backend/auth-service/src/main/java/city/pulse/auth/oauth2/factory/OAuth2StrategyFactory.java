package city.pulse.auth.oauth2.factory;

import city.pulse.auth.model.AuthProvider;
import city.pulse.auth.oauth2.exception.UnsupportedOAuth2ProviderException;
import city.pulse.auth.oauth2.strategy.OAuth2ProviderStrategy;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Component
public class OAuth2StrategyFactory {
    private final Map<AuthProvider, OAuth2ProviderStrategy> strategies;

    public OAuth2StrategyFactory(List<OAuth2ProviderStrategy> strategies) {
        this.strategies = strategies.stream().collect(
                Collectors.toMap(OAuth2ProviderStrategy::getProvider, Function.identity())
        );
    }

    public OAuth2ProviderStrategy getStrategy(AuthProvider provider) {
        var strategy = strategies.get(provider);
        if (strategy == null) {
            throw new UnsupportedOAuth2ProviderException(provider.name());
        }
        return strategy;
    }
}
