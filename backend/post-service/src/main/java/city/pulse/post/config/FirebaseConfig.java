package city.pulse.post.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.storage.Bucket;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.cloud.StorageClient;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.core.io.Resource;

import jakarta.annotation.PostConstruct;
import java.io.IOException;

@Getter
@Configuration
@Profile("prod")
public class FirebaseConfig {
    @Value("${firebase.service-account.path}")
    private Resource serviceAccountResource;

    @Value("${firebase.bucket.name}")
    private String bucketName;

    @Value("${firebase.baseurl}")
    private String baseUrl;

    @PostConstruct
    public void initialize() {
        try {
            var serviceAccount = serviceAccountResource.getInputStream();

            var options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                    .setStorageBucket(bucketName)
                    .build();

            if (FirebaseApp.getApps().isEmpty()) {
                FirebaseApp.initializeApp(options);
            }
        } catch (IOException e) {
            throw new RuntimeException("Failed to initialize Firebase Admin SDK", e);
        }
    }

    @Bean
    public Bucket bucket() {
        return StorageClient.getInstance().bucket();
    }
}