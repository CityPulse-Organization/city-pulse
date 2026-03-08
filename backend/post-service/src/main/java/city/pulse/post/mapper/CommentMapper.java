package city.pulse.post.mapper;

import city.pulse.post.dto.CommentResponseDTO;
import city.pulse.post.model.Comment;
import org.springframework.stereotype.Component;

@Component
public class CommentMapper {
    public CommentResponseDTO toDTO(Comment comment) {
        if (comment == null) return null;

        return CommentResponseDTO.builder()
                .id(comment.getId())
                .postId(comment.getPostId())
                .userId(comment.getUserId())
                .text(comment.getText())
                .createdAt(comment.getCreatedAt())
                .build();
    }
}
