package city.pulse.post.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FileDeleteRequestEvent {
    private String fileUrl;
    private Long postId;
    private String requestId;

    public static FileDeleteRequestEvent of(String fileUrl, Long postId) {
        return new FileDeleteRequestEvent(
                fileUrl,
                postId,
                UUID.randomUUID().toString()
        );
    }
}
