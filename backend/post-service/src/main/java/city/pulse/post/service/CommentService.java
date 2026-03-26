package city.pulse.post.service;

import city.pulse.post.dto.CommentResponse;
import city.pulse.post.model.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface CommentService {
    CommentResponse createComment(Long postId, UUID userId, String text);

    Page<CommentResponse> getCommentsForPost(Long postId, Pageable pageable);

    Comment getCommentEntityByIdOrThrow(Long commentId);

    void deleteComment(Long commentId, UUID userId);
}
