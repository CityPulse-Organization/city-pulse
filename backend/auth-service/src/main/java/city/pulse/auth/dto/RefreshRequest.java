package city.pulse.auth.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RefreshRequest(
    @NotBlank(message = "Refresh token is required")
    @Size(min = 43, max = 44, message = "Refresh token must be between 43 and 44 characters long")
    String refreshToken
) {}
