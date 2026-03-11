package city.pulse.post.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;

@Configuration
@Profile("prod")
public class GcsConfig {
    @Value("${gcp.project-id}")
    private String projectId;

    @Value("${gcp.client-id}")
    private String clientId;

    @Value("${gcp.private-key-id}")
    private String privateKeyId;

    @Value("${gcp.private-key}")
    private String privateKey;

    @Value("${gcp.client-email}")
    private String clientEmail;

    @Bean
    public Storage storage() throws IOException {
        String formattedPrivateKey = privateKey.replace("\\n", "\n");

        String jsonCredentials = String.format(
                "{\"type\": \"service_account\", \"project_id\": \"%s\", \"client_email\": \"%s\", \"client_id\": \"%s\", \"private_key_id\": \"%s\", \"private_key\": \"%s\"}",
                projectId,
                clientEmail,
                clientId,
                privateKeyId,
                formattedPrivateKey.replace("\n", "\\n")
        );

        InputStream serviceAccountStream = new ByteArrayInputStream(jsonCredentials.getBytes(StandardCharsets.UTF_8));

        return StorageOptions.newBuilder()
                .setCredentials(GoogleCredentials.fromStream(serviceAccountStream))
                .setProjectId(projectId)
                .build()
                .getService();
    }
}