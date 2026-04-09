package city.pulse.mobile.feed.service.impl;

import city.pulse.mobile.feed.client.PostClient;
import city.pulse.mobile.feed.client.UserClient;
import city.pulse.mobile.feed.dto.FeedPostResponse;
import city.pulse.mobile.feed.dto.PostResponse;
import city.pulse.mobile.feed.dto.UserProfileResponse;
import city.pulse.mobile.feed.dto.UserProfileScreenResponse;
import city.pulse.mobile.feed.service.FeedService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.web.PagedModel;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FeedServiceImpl implements FeedService {
    private final PostClient postClient;
    private final UserClient userClient;

    public PagedModel<FeedPostResponse> getFeed(int page, int size, UUID userId) {
        var postsPage = postClient.getPosts(page, size, null, userId);

        if (postsPage.getContent().isEmpty()) {
            return new PagedModel<>(new PageImpl<>(
                    List.of(),
                    PageRequest.of(page, size),
                    0
            ));
        }

        var userIds = postsPage.getContent().stream()
                .map(PostResponse::userId)
                .collect(Collectors.toSet());

        var userProfilesMap = userClient.getUsersBatch(userIds)
                .stream()
                .collect(Collectors.toMap(
                        UserProfileResponse::id,
                        profile -> profile
                ));

        var enrichedPosts = postsPage.getContent().stream()
                .map(post -> {
                    var user = userProfilesMap.get(post.userId());
                    return FeedPostResponse.from(post, user);
                })
                .toList();

        return new PagedModel<>(new PageImpl<>(
                enrichedPosts,
                PageRequest.of(page, size),
                postsPage.getMetadata().totalElements()
        ));
    }

    @Override
    public UserProfileScreenResponse getUserProfile(UUID authorId, int page, int size, UUID currentUserId) {
        var authorProfile = userClient.getUserProfileById(authorId);
        var postsPage = postClient.getPosts(page, size, authorId, currentUserId);

        var enrichedPosts = postsPage.getContent().stream()
                .map(post -> FeedPostResponse.from(post, authorProfile))
                .toList();

        var pagedPosts = new PagedModel<>(new PageImpl<>(
                enrichedPosts,
                PageRequest.of(page, size),
                postsPage.getMetadata().totalElements()
        ));

        return UserProfileScreenResponse.from(authorProfile, pagedPosts);
    }
}
