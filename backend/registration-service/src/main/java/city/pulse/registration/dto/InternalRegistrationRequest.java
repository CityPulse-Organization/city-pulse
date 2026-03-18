package city.pulse.registration.dto;

import city.pulse.registration.dto.auth.AuthProvider;
import city.pulse.registration.dto.auth.Role;
import lombok.Builder;

@Builder
public record InternalRegistrationRequest(
    String email,
    String password,
    AuthProvider provider,
    String providerId,
    Role role
) {

    public static InternalRegistrationRequest forLocalUser(String email, String password) {
        return InternalRegistrationRequest.builder()
            .email(email)
            .password(password)
            .provider(AuthProvider.LOCAL)
            .role(Role.USER)
            .build();
    }

    public static InternalRegistrationRequest forOAuth2User(String email, AuthProvider provider, String providerId) {
        return InternalRegistrationRequest.builder()
            .email(email)
            .provider(provider)
            .providerId(providerId)
            .role(Role.USER)
            .build();
    }
}
