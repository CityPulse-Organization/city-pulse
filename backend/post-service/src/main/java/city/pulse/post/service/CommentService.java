package city.pulse.post.service;

import city.pulse.post.dto.CommentResponseDTO;
import city.pulse.post.model.Comment;

import java.util.List;

public interface CommentService {
    CommentResponseDTO createComment(Long postId, Long userId, String text);
    List<CommentResponseDTO> getCommentsForPost(Long postId);
    Comment getCommentEntityByIdOrThrow(Long commentId);
    void deleteComment(Long commentId, Long userId);
}
