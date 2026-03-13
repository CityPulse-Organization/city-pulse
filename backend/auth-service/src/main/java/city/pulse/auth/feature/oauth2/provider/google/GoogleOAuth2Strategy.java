package city.pulse.auth.feature.oauth2.provider.google;

import city.pulse.auth.feature.oauth2.dto.OAuth2UserInfo;
import city.pulse.auth.feature.oauth2.provider.OAuth2Provider;
import city.pulse.auth.feature.oauth2.strategy.OAuth2ProviderStrategy;
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
    public OAuth2Provider getProvider() {
        return OAuth2Provider.GOOGLE;
    }

    @Override
    public OAuth2UserInfo validateAndExtract(String token) {
        try {
            var idToken = verifier.verify(token);

            if (idToken == null) {
                throw new IllegalArgumentException("Invalid Google ID token (check Client ID or expiration)");
            }

            var payload = idToken.getPayload();

            if (!Boolean.TRUE.equals(payload.getEmailVerified())) {
                throw new IllegalArgumentException("Google account email is not verified");
            }

            return new OAuth2UserInfo(payload.getEmail(), (String) payload.get("name"), payload.getSubject());
        } catch (Exception e) {
            throw new IllegalArgumentException("Failed to verify Google token: " + e.getMessage(), e);
        }
    }
}