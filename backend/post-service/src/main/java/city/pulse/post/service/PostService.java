package city.pulse.post.service;

import city.pulse.post.dto.PostResponse;
import city.pulse.post.model.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface PostService {
    PostResponse createPost(String imageUrl, String caption, UUID userId);

    void likePost(Long postId, UUID userId);

    PostResponse getPostById(Long postId);

    Post getPostEntityByIdOrThrow(Long postId);

    Page<PostResponse> getPostsByUserId(UUID userId, Pageable pageable);

    PostResponse updatePostCaption(Long postId, UUID currentUserId, String newCaption);

    void deletePost(Long postId, UUID currentUserId);

    void unlikePost(Long postId, UUID userId);
}
