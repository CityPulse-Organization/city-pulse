package city.pulse.post.dto;

import lombok.Builder;
import lombok.Data;
import java.time.OffsetDateTime;

@Data
@Builder
public class CommentResponseDTO {
    private Long id;
    private Long postId;
    private Long userId;
    private String text;
    private OffsetDateTime createdAt;
}