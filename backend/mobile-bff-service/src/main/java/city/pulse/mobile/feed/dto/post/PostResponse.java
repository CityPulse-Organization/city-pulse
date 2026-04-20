package city.pulse.mobile.feed.dto.post;

import lombok.Builder;

import java.time.OffsetDateTime;
import java.util.UUID;

@Builder
public record PostResponse(
        Long id,
        UUID userId,
        String imageUrl,
        String caption,
        OffsetDateTime createdAt,
        int likeCount,
        int commentCount,
        boolean isLikedByMe,
        boolean isSavedByMe
) {}
