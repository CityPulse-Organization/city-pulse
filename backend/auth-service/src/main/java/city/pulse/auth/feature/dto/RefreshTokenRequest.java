package city.pulse.auth.feature.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RefreshTokenRequest(
    @NotBlank(message = "Token is required")
    @Size(min = 43, max = 44, message = "Token must be between 43 and 44 characters long")
    String token
) {}
