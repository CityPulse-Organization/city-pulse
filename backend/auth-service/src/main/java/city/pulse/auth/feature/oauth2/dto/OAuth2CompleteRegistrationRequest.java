package city.pulse.auth.feature.oauth2.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record OAuth2CompleteRegistrationRequest(
        @NotBlank(message = "Token is required")
        String token,

        @NotBlank(message = "Username is required")
        @Size(min = 4, max = 32, message = "Username must be between 4 and 32 characters long")
        String username
) {}