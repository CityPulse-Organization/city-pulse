package city.pulse.auth.feature.oauth2.dto;

import jakarta.validation.constraints.NotBlank;

public record OAuth2LoginRequest(
        @NotBlank(message = "Token is required")
        String token
) {}