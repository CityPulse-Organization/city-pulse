package city.pulse.post.dto;

import lombok.Builder;
import lombok.Data;

import java.time.OffsetDateTime;
import java.util.UUID;

@Data
@Builder
public class CommentResponseDTO {
    private Long id;
    private Long postId;
    private UUID userId;
    private String text;
    private OffsetDateTime createdAt;
}
