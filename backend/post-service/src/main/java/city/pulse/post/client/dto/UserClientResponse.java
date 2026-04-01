package city.pulse.post.client.dto;

import java.util.UUID;

public record UserClientResponse(
    UUID id,
    String username,
    String avatarUrl
) {
}
