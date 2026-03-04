package city.pulse.auth.feature.dto;

public record AuthResponse(
    String accessToken,
    String refreshToken
) {}
