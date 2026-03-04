package city.pulse.auth.feature.dto;

public record RegistrationResponse(
    Long id,
    String username,
    String email
) {}
