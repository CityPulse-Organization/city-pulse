package city.pulse.registration.dto.auth;

import city.pulse.registration.model.AuthProvider;
import city.pulse.registration.model.Role;
import lombok.Builder;

@Builder
public record InternalLocalRegistrationRequest(
        String email,
        String password,
        AuthProvider provider,
        Role role
) {
    public static InternalLocalRegistrationRequest build(String email, String password, Role role) {
        return InternalLocalRegistrationRequest.builder()
                .email(email)
                .password(password)
                .provider(AuthProvider.LOCAL)
                .role(role)
                .build();
    }
}
