package city.pulse.post.config;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

@Configuration
public class KafkaProducerConfig {
    @Value("${app.kafka.topics.file-deleted}")
    private String fileDeletionTopic;

    @Bean
    public NewTopic fileDeletionTopic() {
        return TopicBuilder.name(fileDeletionTopic)
                .partitions(3)
                .replicas(1)
                .build();
    }
}
