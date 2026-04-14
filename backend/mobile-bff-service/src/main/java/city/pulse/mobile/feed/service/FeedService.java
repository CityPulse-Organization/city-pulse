package city.pulse.mobile.feed.service;

import city.pulse.mobile.feed.dto.post.FeedPostResponse;
import city.pulse.mobile.feed.dto.user.UserProfileScreenResponse;
import org.springframework.data.web.PagedModel;

import java.util.UUID;

public interface FeedService {
    PagedModel<FeedPostResponse> getFeed(int page, int size, UUID userId);

    UserProfileScreenResponse getUserProfile(UUID authorId, int page, int size, UUID userId);
}
