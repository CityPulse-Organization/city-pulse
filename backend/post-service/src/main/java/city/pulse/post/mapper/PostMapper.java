package city.pulse.post.mapper;

import city.pulse.post.dto.PostResponse;
import city.pulse.post.model.post.Post;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PostMapper {
    PostResponse toDto(Post post, boolean isLikedByMe, boolean isSavedByMe);
}
