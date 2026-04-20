package city.pulse.mobile.feed.dto.comment;

import city.pulse.mobile.feed.dto.user.UserProfileResponse;
import lombok.Builder;
import java.time.OffsetDateTime;
import java.util.UUID;

@Builder
public record FeedCommentResponse(
        Long id,
        Long postId,
        Long parentId,
        String text,
        OffsetDateTime createdAt,
        int likeCount,
        int replyCount,
        boolean isLikedByMe,

        UUID authorId,
        String authorUsername,
        String authorAvatarUrl
) {
    public static FeedCommentResponse from(CommentResponse comment, UserProfileResponse user) {
        var username = user != null ? user.username() : "Unknown User";
        var avatarUrl = user != null ? user.avatarUrl() : null;

        return FeedCommentResponse.builder()
                .id(comment.id())
                .postId(comment.postId())
                .parentId(comment.parentId())
                .text(comment.text())
                .createdAt(comment.createdAt())
                .likeCount(comment.likeCount())
                .replyCount(comment.replyCount())
                .isLikedByMe(comment.isLikedByMe())
                .authorId(comment.userId())
                .authorUsername(username)
                .authorAvatarUrl(avatarUrl)
                .build();
    }
}
