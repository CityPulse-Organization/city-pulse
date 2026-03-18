package city.pulse.registration.dto;

import java.util.UUID;

public record RegistrationResponse(
        UUID userId,
        String email,
        String message
) {
    public static RegistrationResponse success(UUID userId, String email) {
        return new RegistrationResponse(userId, email, "Account created successfully. You can now log in.");
    }
}