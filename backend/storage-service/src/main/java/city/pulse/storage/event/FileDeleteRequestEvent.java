package city.pulse.storage.event;

public record FileDeleteRequestEvent(
        String fileUrl,
        Long postId,
        String requestId
) {}
