package city.pulse.registration.event;

import city.pulse.registration.client.AuthServiceClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class UserDeletedEventListener {
    private final AuthServiceClient authClient;

    @KafkaListener(topics = "${app.kafka.topics.user-deleted}", groupId = "${spring.kafka.consumer.group-id}")
    public void handleUserDeleted(UserDeletedEvent event) {
        log.info("Received user deleted event for userId: {}", event.userId());

        try {
            authClient.deleteCredential(event.userId());
            log.info("Successfully deleted credentials for userId: {}", event.userId());
        } catch (Exception e) {
            log.error("Error deleting credentials for userId: {}", event.userId(), e);
            throw e;
        }
    }
}
