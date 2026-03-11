package city.pulse.post.service.impl;

import city.pulse.post.exception.FileUploadingException;
import city.pulse.post.service.FileUploadService;
import com.google.cloud.storage.BlobId;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Storage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Set;
import java.util.UUID;

@Slf4j
@Service
@Profile("prod")
@RequiredArgsConstructor
public class GcsFileUploadServiceImpl implements FileUploadService {
    private final Storage storage;

    @Value("${gcp.bucket.name}")
    private String bucketName;

    @Value("${gcp.storage.base-url:https://storage.googleapis.com}")
    private String baseUrl;

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
            var blobId = BlobId.of(bucketName, fileName);
            var blobInfo = BlobInfo.newBuilder(blobId)
                    .setContentType(contentType)
                    .build();

            storage.create(blobInfo, file.getBytes());
        } catch (Exception ex) {
            log.error("Error uploading file to Google Cloud Storage", ex);
            throw new FileUploadingException(ex.getMessage());
        }

        return String.format("%s/%s/%s", baseUrl, bucketName, fileName);
    }

    @Override
    public void deleteFile(String imageUrl) {
        try {
            var fileName = imageUrl.substring(imageUrl.lastIndexOf("/") + 1);
            var blobId = BlobId.of(bucketName, fileName);

            boolean deleted = storage.delete(blobId);
            if (!deleted) {
                log.warn("File {} was not found or could not be deleted from GCS", fileName);
            }
        } catch (Exception ex) {
            log.error("Failed to delete file from GCS: {}", imageUrl, ex);
        }
    }
}