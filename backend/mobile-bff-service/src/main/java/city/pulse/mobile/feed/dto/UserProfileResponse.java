package city.pulse.mobile.feed.dto;

import java.util.UUID;

public record UserProfileResponse(
        UUID id,
        String username,
        String bio,
        String jobTitle,
        String avatarUrl) {
}
