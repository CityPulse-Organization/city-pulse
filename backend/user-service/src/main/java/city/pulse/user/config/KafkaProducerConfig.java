package city.pulse.user.config;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

@Configuration
public class KafkaProducerConfig {
    @Value("${app.kafka.topics.user-deleted}")
    private String userDeletionTopic;

    @Bean
    public NewTopic userDeletionTopic() {
        return TopicBuilder.name(userDeletionTopic)
                .partitions(3)
                .replicas(1)
                .build();
    }
}
