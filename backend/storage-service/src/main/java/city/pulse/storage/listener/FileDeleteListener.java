package city.pulse.storage.listener;

import city.pulse.storage.event.FileDeleteRequestEvent;
import city.pulse.storage.service.FileUploadService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class FileDeleteListener {
    private final FileUploadService service;

    @KafkaListener(
            topics = "${app.kafka.topics.file-deletion-requests}",
            groupId = "${spring.kafka.consumer.group-id}",
            containerFactory = "kafkaListenerContainerFactory"
    )
    public void handleFileDeleteRequest(FileDeleteRequestEvent event) {
        log.info("Received file deletion request: fileUrl={}, postId={}, requestId={}", event.getFileUrl(), event.getPostId(), event.getRequestId());

        try {
            service.deleteFile(event.getFileUrl());
            log.info("Successfully deleted file: fileUrl={}, postId={}, requestId={}", event.getFileUrl(), event.getPostId(), event.getRequestId());
        } catch (Exception e) {
            log.error("Failed to delete file: fileUrl={}, postId={}, requestId={}, error={}", event.getFileUrl(), event.getPostId(), event.getRequestId(), e.getMessage(), e);
        }
    }
}
