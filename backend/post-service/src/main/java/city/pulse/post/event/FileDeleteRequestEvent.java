package city.pulse.post.event;

import java.util.UUID;

public record FileDeleteRequestEvent(
        String fileUrl,
        Long postId,
        String requestId
) {
    public static FileDeleteRequestEvent of(String fileUrl, Long postId) {
        return new FileDeleteRequestEvent(
                fileUrl,
                postId,
                UUID.randomUUID().toString()
        );
    }
}
