package city.pulse.user.producer;

import city.pulse.user.event.UserDeletedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class UserEventProducer {
    private final KafkaTemplate<String, Object> kafka;

    @Value("${app.kafka.topics.user-deleted}")
    private String topic;

    public void sendUserDeletedEvent(UserDeletedEvent event) {
        log.info("Sending user deleted event to Kafka for userId: {}", event.userId());

        kafka.send(topic, event.userId().toString(), event)
                .whenComplete((result, ex) -> {
                    if (ex != null) {
                        log.error("Failed to send user deleted event for userId: {}", event.userId(), ex);
                    } else {
                        log.info("Successfully sent user deleted event for userId: {}, partition: {}",
                                event.userId(), result.getRecordMetadata().partition());
                    }
                });
    }
}
