package city.pulse.mobile.feed.service;

import city.pulse.mobile.feed.dto.post.FeedPostResponse;
import org.springframework.data.web.PagedModel;

import java.util.UUID;

public interface FeedService {
    PagedModel<FeedPostResponse> getFeed(int page, int size, UUID userId);

    PagedModel<FeedPostResponse> getSaved(int page, int size, UUID userId);
}
