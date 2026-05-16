package city.pulse.post.mapper;

import city.pulse.post.dto.PostResponse;
import city.pulse.post.model.post.Post;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface PostMapper {
    @Mapping(target = "latitude", expression = "java(post.getLocation() != null ? post.getLocation().getY() : null)")
    @Mapping(target = "longitude", expression = "java(post.getLocation() != null ? post.getLocation().getX() : null)")
    PostResponse toDto(Post post, boolean isLikedByMe, boolean isSavedByMe);
}
