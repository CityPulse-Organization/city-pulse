package city.pulse.registration.dto.auth;

import city.pulse.registration.model.AuthProvider;
import city.pulse.registration.model.Role;
import lombok.Builder;

@Builder
public record InternalOAuth2RegistrationRequest(
        String email,
        AuthProvider provider,
        String providerId,
        Role role
) {
    public static InternalOAuth2RegistrationRequest build(String email, AuthProvider provider, String providerId, Role role) {
        return InternalOAuth2RegistrationRequest.builder()
                .email(email)
                .provider(provider)
                .providerId(providerId)
                .role(role)
                .build();
    }
}
