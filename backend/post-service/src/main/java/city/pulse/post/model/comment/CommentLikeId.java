package city.pulse.post.model.comment;

import java.io.Serializable;
import java.util.UUID;

public record CommentLikeId(Long commentId, UUID userId) implements Serializable {}
