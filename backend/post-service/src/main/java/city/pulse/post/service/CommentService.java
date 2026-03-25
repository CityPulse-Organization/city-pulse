package city.pulse.post.service;

import city.pulse.post.dto.CommentResponseDTO;
import city.pulse.post.model.Comment;

import java.util.List;
import java.util.UUID;

public interface CommentService {
    CommentResponseDTO createComment(Long postId, UUID userId, String text);

    List<CommentResponseDTO> getCommentsForPost(Long postId);

    Comment getCommentEntityByIdOrThrow(Long commentId);

    void deleteComment(Long commentId, UUID userId);
}
