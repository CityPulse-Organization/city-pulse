package city.pulse.storage.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FileDeleteRequestEvent {
    private String fileUrl;
    private Long postId;
    private String requestId;
}
