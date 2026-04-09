package city.pulse.mobile.feed.dto;

import lombok.Builder;
import org.springframework.data.web.PagedModel;

import java.util.UUID;

@Builder
public record UserProfileScreenResponse(
        UUID id,
        String username,
        String bio,
        String jobTitle,
        String avatarUrl,

        PagedModel<FeedPostResponse> posts
) {
    public static UserProfileScreenResponse from(UserProfileResponse user, PagedModel<FeedPostResponse> posts) {
        return UserProfileScreenResponse.builder()
                .id(user.id())
                .username(user.username())
                .bio(user.bio())
                .jobTitle(user.jobTitle())
                .avatarUrl(user.avatarUrl())
                .posts(posts)
                .build();
    }
}
