package city.pulse.post.dto;

import lombok.Builder;

import java.time.OffsetDateTime;
import java.util.UUID;

@Builder
public record CommentResponse(
        Long id,
        Long postId,
        Long parentId,
        UUID userId,
        String text,
        OffsetDateTime createdAt,
        int likeCount,
        int replyCount,
        boolean isLikedByMe
) {}
