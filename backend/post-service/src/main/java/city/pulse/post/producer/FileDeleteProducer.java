package city.pulse.post.producer;

import city.pulse.post.event.FileDeleteRequestEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class FileDeleteProducer {
    private final KafkaTemplate<String, Object> kafka;

    @Value("${app.kafka.topics.file-deletion-requests}")
    private String topic;

    public void sendFileDeleteRequest(String fileUrl, Long postId) {
        var event = FileDeleteRequestEvent.of(fileUrl, postId);
        log.info("Sending file deletion request: fileUrl={}, postId={}, requestId={}", fileUrl, postId, event.getRequestId());

        kafka.send(topic, event.getRequestId(), event)
                .whenComplete((result, ex) -> {
                    if (ex != null) {
                        log.error("Failed to send file deletion request: fileUrl={}, postId={}, error={}", fileUrl, postId, ex.getMessage());
                    } else {
                        log.info("Successfully sent file deletion request: fileUrl={}, postId={}, partition={}", fileUrl, postId, result.getRecordMetadata().partition());
                    }
                });
    }
}
