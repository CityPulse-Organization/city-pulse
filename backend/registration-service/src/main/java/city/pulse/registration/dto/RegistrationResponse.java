package city.pulse.registration.dto;

import java.util.UUID;

public record RegistrationResponse(UUID userId, String email) {}
