package city.pulse.post.mapper;

import city.pulse.post.dto.CommentResponse;
import city.pulse.post.model.comment.Comment;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CommentMapper {
    CommentResponse toDTO(Comment comment, boolean isLikedByMe);
}
