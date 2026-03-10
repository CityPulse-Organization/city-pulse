package city.pulse.auth.feature.oauth2.provider.google;

import city.pulse.auth.feature.oauth2.dto.OAuth2UserInfo;
import city.pulse.auth.feature.oauth2.provider.OAuth2Provider;
import city.pulse.auth.feature.oauth2.strategy.OAuth2ProviderStrategy;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
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
            GoogleIdToken idToken = verifier.verify(token);
            if (idToken != null) {
                GoogleIdToken.Payload payload = idToken.getPayload();

                Boolean emailVerified = payload.getEmailVerified();
                if (emailVerified == null || !emailVerified) {
                    throw new IllegalArgumentException("Google account email is not verified");
                }

                return new OAuth2UserInfo(
                        payload.getEmail(),
                        (String) payload.get("name"),
                        payload.getSubject()
                );
            } else {
                throw new IllegalArgumentException("Invalid Google ID token (check Client ID or expiration)");
            }
        } catch (Exception e) {
            throw new IllegalArgumentException("Failed to verify Google token: " + e.getMessage());
        }
    }
}