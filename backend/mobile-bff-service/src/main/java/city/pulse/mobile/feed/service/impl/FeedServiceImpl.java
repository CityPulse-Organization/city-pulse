package city.pulse.mobile.feed.service.impl;

import city.pulse.mobile.feed.client.PostClient;
import city.pulse.mobile.feed.client.UserClient;
import city.pulse.mobile.feed.dto.post.FeedPostResponse;
import city.pulse.mobile.feed.dto.post.PostResponse;
import city.pulse.mobile.feed.dto.user.UserProfileScreenResponse;
import city.pulse.mobile.feed.service.FeedService;
import city.pulse.mobile.feed.util.UserEnrichmentHelper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.web.PagedModel;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FeedServiceImpl implements FeedService {
    private final UserEnrichmentHelper enricher;
    private final PostClient postClient;
    private final UserClient userClient;

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
    public UserProfileScreenResponse getUserProfile(UUID authorId, int page, int size, UUID currentUserId) {
        var authorProfile = userClient.getUserProfileById(authorId);
        var postsPage = postClient.getPosts(page, size, authorId, currentUserId);

        var enrichedPosts = postsPage.content().stream()
                .map(post -> FeedPostResponse.from(post, authorProfile))
                .toList();

        var pagedPosts = new PagedModel<>(new PageImpl<>(
                enrichedPosts,
                PageRequest.of(page, size),
                postsPage.page().totalElements()
        ));

        return UserProfileScreenResponse.from(authorProfile, pagedPosts);
    }
}
