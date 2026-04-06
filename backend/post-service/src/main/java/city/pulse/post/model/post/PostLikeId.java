package city.pulse.post.model.post;

import java.io.Serializable;
import java.util.UUID;

public record PostLikeId(Long postId, UUID userId) implements Serializable {}
