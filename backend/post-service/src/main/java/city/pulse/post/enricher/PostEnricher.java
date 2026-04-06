package city.pulse.post.enricher;

import city.pulse.post.dto.PostResponse;
import city.pulse.post.mapper.PostMapper;
import city.pulse.post.model.post.Post;
import city.pulse.post.model.post.PostLikeId;
import city.pulse.post.model.saved.SavedPostId;
import city.pulse.post.repository.PostLikeRepository;
import city.pulse.post.repository.SavedPostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@RequiredArgsConstructor
public class PostEnricher {
    private final SavedPostRepository savedRepository;
    private final PostLikeRepository likeRepository;
    private final PostMapper mapper;

    public Page<PostResponse> enrichPage(Page<Post> postsPage, UUID currentUserId) {
        if (postsPage.isEmpty()) return Page.empty(postsPage.getPageable());

        var postIds = postsPage.stream().map(Post::getId).toList();
        var likedPostIds = likeRepository.findLikedPostIdsByUserIdAndPostIds(currentUserId, postIds);
        var savedPostIds = savedRepository.findSavedPostIdsByUserIdAndPostIds(currentUserId, postIds);

        return postsPage.map(post -> mapper.toDto(
                post,
                likedPostIds.contains(post.getId()),
                savedPostIds.contains(post.getId())
        ));
    }

    public PostResponse enrichPost(Post post, UUID currentUserId) {
        var isLikedByMe = likeRepository.existsById(new PostLikeId(post.getId(), currentUserId));
        var isSavedByMe = savedRepository.existsById(new SavedPostId(post.getId(), currentUserId));
        return mapper.toDto(post, isLikedByMe, isSavedByMe);
    }
}
