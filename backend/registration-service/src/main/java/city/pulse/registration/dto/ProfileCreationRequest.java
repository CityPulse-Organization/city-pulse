package city.pulse.registration.dto;

import java.util.UUID;

public record ProfileCreationRequest(UUID userId, String username) {
}
