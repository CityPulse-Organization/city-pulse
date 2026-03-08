package city.pulse.post.service;

import city.pulse.post.dto.PostResponseDTO;
import city.pulse.post.model.Post;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface PostService {
    PostResponseDTO createPost(MultipartFile file, String caption, Long userId);
    void likePost(Long postId, Long userId);
    PostResponseDTO getPostById(Long postId);
    Post getPostEntityByIdOrThrow(Long postId);
    List<PostResponseDTO> getPostsByUserId(Long userId);
    PostResponseDTO updatePostCaption(Long postId, Long currentUserId, String newCaption);
    void deletePost(Long postId, Long currentUserId);
    void unlikePost(Long postId, Long userId);
}
