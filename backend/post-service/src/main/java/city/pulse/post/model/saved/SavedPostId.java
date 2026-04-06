package city.pulse.post.model.saved;

import java.io.Serializable;
import java.util.UUID;

public record SavedPostId (Long postId, UUID userId) implements Serializable {}
