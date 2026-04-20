package city.pulse.mobile.feed.dto.post;

import city.pulse.mobile.feed.dto.user.UserProfileResponse;
import lombok.Builder;

import java.time.OffsetDateTime;
import java.util.UUID;

@Builder
public record FeedPostResponse(
        Long id,
        String imageUrl,
        String caption,
        OffsetDateTime createdAt,
        int likeCount,
        int commentCount,
        boolean isLikedByMe,
        boolean isSavedByMe,

        UUID authorId,
        String authorUsername,
        String authorAvatarUrl
) {
    public static FeedPostResponse from(PostResponse post, UserProfileResponse user) {
        var username = user != null ? user.username() : "Unknown User";
        var avatarUrl = user != null ? user.avatarUrl() : null;

        return FeedPostResponse.builder()
                .id(post.id())
                .imageUrl(post.imageUrl())
                .caption(post.caption())
                .createdAt(post.createdAt())
                .likeCount(post.likeCount())
                .commentCount(post.commentCount())
                .isLikedByMe(post.isLikedByMe())
                .isSavedByMe(post.isSavedByMe())
                .authorId(post.userId())
                .authorUsername(username)
                .authorAvatarUrl(avatarUrl)
                .build();
    }
}
