package city.pulse.mobile.feed.dto.comment;

import lombok.Builder;

import java.time.OffsetDateTime;
import java.util.UUID;

@Builder
public record CommentResponse(
        Long id,
        UUID userId,
        String text,
        OffsetDateTime createdAt,
        int likeCount,
        int replyCount,
        boolean isLikedByMe
) {}
