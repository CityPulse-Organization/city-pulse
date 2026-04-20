package city.pulse.mobile.feed.service.impl;

import city.pulse.mobile.feed.client.PostClient;
import city.pulse.mobile.feed.dto.post.FeedPostResponse;
import city.pulse.mobile.feed.dto.post.PostResponse;
import city.pulse.mobile.feed.service.FeedService;
import city.pulse.mobile.feed.util.UserEnrichmentHelper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.web.PagedModel;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FeedServiceImpl implements FeedService {
    private final UserEnrichmentHelper enricher;
    private final PostClient postClient;

    @Override
    public PagedModel<FeedPostResponse> getFeed(int page, int size, UUID userId) {
        var postsPage = postClient.getPosts(page, size, null, userId);

        return enricher.enrichWithUsers(
                postsPage, page, size,
                PostResponse::userId,
                FeedPostResponse::from
        );
    }

    @Override
    public PagedModel<FeedPostResponse> getSaved(int page, int size, UUID userId) {
        var savedPostsPage = postClient.getSaved(page, size, userId);

        return enricher.enrichWithUsers(
                savedPostsPage, page, size,
                PostResponse::userId,
                FeedPostResponse::from
        );
    }
}
