package city.pulse.auth.dto.internal;

import city.pulse.auth.model.AuthProvider;
import city.pulse.auth.model.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;

@Builder
public record InternalOAuth2RegistrationRequest(
        @Email(message = "Invalid email format")
        @NotBlank(message = "Email is required")
        String email,

        @NotNull(message = "Provider is required")
        AuthProvider provider,

        @NotBlank(message = "Provider ID is required")
        String providerId,

        @NotNull(message = "Role is required")
        Role role
) {
}
