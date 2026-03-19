package city.pulse.user.dto;

import java.util.UUID;

public record ProfileCreationRequest(UUID userId, String username) {}
