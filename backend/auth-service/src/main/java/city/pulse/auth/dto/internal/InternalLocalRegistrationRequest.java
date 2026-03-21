package city.pulse.auth.dto.internal;

import city.pulse.auth.model.AuthProvider;
import city.pulse.auth.model.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Builder;

@Builder
public record InternalLocalRegistrationRequest(
        @Email(message = "Invalid email format")
        @NotBlank(message = "Email is required")
        String email,

        @NotBlank(message = "Password is required")
        @Size(min = 6, max = 255, message = "Password must be between 6 and 255 characters long")
        String password,

        @NotNull(message = "Provider is required")
        AuthProvider provider,

        @NotNull(message = "Role is required")
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
