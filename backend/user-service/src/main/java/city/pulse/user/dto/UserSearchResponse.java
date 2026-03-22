package city.pulse.user.dto;

import java.util.UUID;

public record UserSearchResponse(
        UUID id,
        String username
) {
}
