package city.pulse.post.dto;

import lombok.Builder;
import lombok.Data;

import java.time.OffsetDateTime;
import java.util.UUID;

@Data
@Builder
public class PostResponseDTO {
    private Long id;
    private UUID userId;
    private String imageUrl;
    private String caption;
    private OffsetDateTime createdAt;
    private int likeCount;
    private int commentCount;
}
