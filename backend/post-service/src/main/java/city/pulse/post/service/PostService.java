package city.pulse.post.service;

import city.pulse.post.dto.PostFilterRequest;
import city.pulse.post.dto.PostResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface PostService {
    PostResponse createPost(String imageUrl, String caption, Double latitude, Double longitude, UUID userId);

    Page<PostResponse> getPosts(PostFilterRequest filter, UUID currentUserId, Pageable pageable);

    Page<PostResponse> getSavedPosts(UUID currentUserId, Pageable pageable);

    PostResponse getPostById(Long postId, UUID currentUserId);

    PostResponse updatePostCaption(Long postId, UUID currentUserId, String newCaption);

    void deletePost(Long postId, UUID currentUserId);

    void deleteAllUserPosts(UUID userId);
}
