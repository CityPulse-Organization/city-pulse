package city.pulse.post.service;

import java.util.UUID;

public interface PostInteractionService {
    void likePost(Long postId, UUID userId);

    void unlikePost(Long postId, UUID userId);

    void savePost(Long postId, UUID userId);

    void unsavePost(Long postId, UUID userId);
}
