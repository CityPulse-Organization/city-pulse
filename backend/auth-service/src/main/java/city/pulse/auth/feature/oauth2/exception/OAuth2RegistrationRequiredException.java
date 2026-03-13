package city.pulse.auth.feature.oauth2.exception;

import city.pulse.auth.feature.oauth2.provider.OAuth2Provider;
import lombok.Getter;

@Getter
public class OAuth2RegistrationRequiredException extends RuntimeException {
    private final String email;
    private final OAuth2Provider provider;

    public OAuth2RegistrationRequiredException(String email, OAuth2Provider provider) {
        super("User not found. Please provide a username.");
        this.email = email;
        this.provider = provider;
    }
}