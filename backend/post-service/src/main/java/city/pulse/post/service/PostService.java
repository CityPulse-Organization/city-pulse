package city.pulse.post.service;

import city.pulse.post.dto.PostResponseDTO;
import city.pulse.post.model.Post;

import java.util.List;
import java.util.UUID;

public interface PostService {
    PostResponseDTO createPost(String imageUrl, String caption, UUID userId);

    void likePost(Long postId, UUID userId);

    PostResponseDTO getPostById(Long postId);

    Post getPostEntityByIdOrThrow(Long postId);

    List<PostResponseDTO> getPostsByUserId(UUID userId);

    PostResponseDTO updatePostCaption(Long postId, UUID currentUserId, String newCaption);

    void deletePost(Long postId, UUID currentUserId);

    void unlikePost(Long postId, UUID userId);
}