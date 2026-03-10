package city.pulse.auth.feature.oauth2.exception;

public class UnsupportedOAuth2ProviderException extends RuntimeException {
    public UnsupportedOAuth2ProviderException(String provider) {
        super("Unsupported OAuth2 provider: " + provider);
    }
}
