package city.pulse.auth.oauth2.strategy.provider;

import city.pulse.auth.oauth2.dto.OAuth2UserInfo;
import city.pulse.auth.oauth2.exception.InvalidIdTokenException;
import city.pulse.auth.oauth2.exception.UnverifiedEmailException;
import city.pulse.auth.model.AuthProvider;
import city.pulse.auth.oauth2.strategy.OAuth2ProviderStrategy;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Collections;

@Component
public class GoogleOAuth2Strategy implements OAuth2ProviderStrategy {
    private final GoogleIdTokenVerifier verifier;

    public GoogleOAuth2Strategy(@Value("${spring.security.oauth2.client.registration.google.client-id}") String clientId) {
        this.verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new GsonFactory())
                .setAudience(Collections.singletonList(clientId))
                .build();
    }

    @Override
    public AuthProvider getProvider() {
        return AuthProvider.GOOGLE;
    }

    @Override
    public OAuth2UserInfo validateAndExtract(String token) {
        try {
            var idToken = verifier.verify(token);

            if (idToken == null) {
                throw new InvalidIdTokenException("Invalid Google ID id token (check Client ID or expiration)");
            }

            var payload = idToken.getPayload();

            if (!Boolean.TRUE.equals(payload.getEmailVerified())) {
                throw new UnverifiedEmailException("Google account email is not verified");
            }

            return new OAuth2UserInfo(payload.getSubject(), payload.getEmail(), payload.getEmailVerified());
        } catch (Exception e) {
            throw new InvalidIdTokenException("Failed to verify Google id token: " + e.getMessage());
        }
    }
}