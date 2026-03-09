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

import jakarta.annotation.PostConstruct;
import org.springframework.core.io.ClassPathResource;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;

@Getter
@Configuration
public class FirebaseConfig {
    @Value("${app.firebase.config:classpath:db/data/city-pulse-google-cloud-account.json}")
    private String firebaseConfigRaw;

    @Value("${firebase.bucket.name}")
    private String bucketName;

    @Value("${firebase.baseurl}")
    private String baseUrl;

    @PostConstruct
    public void initialize() {
        try {
            InputStream serviceAccount;

            if (firebaseConfigRaw.trim().startsWith("{")) {
                serviceAccount = new ByteArrayInputStream(firebaseConfigRaw.getBytes(StandardCharsets.UTF_8));
            } else {
                String path = firebaseConfigRaw.replace("classpath:", "");
                serviceAccount = new ClassPathResource(path).getInputStream();
            }

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