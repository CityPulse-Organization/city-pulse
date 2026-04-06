package city.pulse.post.service;

import city.pulse.post.dto.CommentResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface CommentService {
    CommentResponse createComment(Long postId, Long parentId, UUID userId, String text);

    Page<CommentResponse> getCommentsForPost(Long postId, UUID currentUserId, Pageable pageable);

    Page<CommentResponse> getRepliesForComment(Long commentId, UUID currentUserId, Pageable pageable);

    void deleteComment(Long commentId, UUID userId);
}
