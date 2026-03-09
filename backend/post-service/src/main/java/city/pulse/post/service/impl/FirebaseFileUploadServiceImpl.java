package city.pulse.post.service.impl;

import city.pulse.post.config.FirebaseConfig;
import city.pulse.post.exception.FileUploadingException;
import city.pulse.post.service.FileUploadService;
import com.google.cloud.storage.Bucket;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Set;
import java.util.UUID;

@Slf4j
@Service
@Profile("prod")
@RequiredArgsConstructor
public class FirebaseFileUploadServiceImpl implements FileUploadService {
    private final FirebaseConfig config;
    private final Bucket bucket;

    private static final Set<String> ALLOWED_MIME_TYPES = Set.of(
            "image/jpeg",
            "image/heic",
            "image/heif"
    );

    @Override
    public String uploadFile(MultipartFile file) {
        var contentType = file.getContentType();
        if (contentType == null || !ALLOWED_MIME_TYPES.contains(contentType.toLowerCase())) {
            throw new FileUploadingException("File upload failed: Only JPEG or HEIC images are allowed.");
        }

        var fileName = UUID.randomUUID() + "|=" + file.getOriginalFilename();

        try {
            bucket.create(fileName, file.getBytes(), file.getContentType());
        } catch (Exception ex) {
            log.error("Error uploading file to Firebase Storage", ex);
            throw new FileUploadingException(ex.getMessage());
        }

        return String.format("%s/%s/%s", config.getBaseUrl(), config.getBucketName(), fileName);
    }

    @Override
    public void deleteFile(String imageUrl) {
        try {
            var fileName = imageUrl.substring(imageUrl.lastIndexOf("/") + 1);
            var blob = bucket.get(fileName);

            if (blob != null) {
                blob.delete();
            }
        } catch (Exception ex) {
            log.error("Failed to delete file from Firebase: {}", imageUrl, ex);
        }
    }
}