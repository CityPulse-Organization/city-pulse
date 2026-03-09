package city.pulse.post.mapper;

import city.pulse.post.dto.PostResponseDTO;
import city.pulse.post.model.Post;
import org.springframework.stereotype.Component;

@Component
public class PostMapper {
    public PostResponseDTO toDto(Post post) {
        if (post == null) return null;

        return PostResponseDTO.builder()
                .id(post.getId())
                .userId(post.getUserId())
                .imageUrl(post.getImageUrl())
                .caption(post.getCaption())
                .createdAt(post.getCreatedAt())
                .likeCount(post.getLikeCount())
                .commentCount(post.getCommentCount())
                .build();
    }
}