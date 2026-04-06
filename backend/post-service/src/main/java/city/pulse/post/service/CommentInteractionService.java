package city.pulse.post.service;

import java.util.UUID;

public interface CommentInteractionService {
    void likeComment(Long commentId, UUID userId);

    void unlikeComment(Long commentId, UUID userId);
}
