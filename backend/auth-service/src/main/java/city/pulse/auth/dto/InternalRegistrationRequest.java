package city.pulse.auth.dto;

import city.pulse.auth.model.AuthProvider;
import city.pulse.auth.model.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record InternalRegistrationRequest(
        @Email
        @NotBlank
        String email,

        String password,

        @NotNull
        AuthProvider provider,

        String providerId,

        @NotNull
        Role role
) {}
