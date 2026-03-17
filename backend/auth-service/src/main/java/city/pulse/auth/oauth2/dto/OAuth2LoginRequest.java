package city.pulse.auth.oauth2.dto;

import jakarta.validation.constraints.NotBlank;

public record OAuth2LoginRequest(
        @NotBlank(message = "ID Token is required")
        String idToken
) {}
