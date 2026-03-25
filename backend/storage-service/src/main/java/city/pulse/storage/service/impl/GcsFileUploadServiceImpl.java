package city.pulse.storage.service.impl;

import city.pulse.storage.config.StorageConfig;
import city.pulse.storage.exception.FileUploadingException;
import com.google.cloud.storage.BlobId;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Storage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@Service
@Profile("prod")
public class GcsFileUploadServiceImpl extends AbstractFileUploadService {
    private final Storage storage;

    @Value("${gcp.bucket.name}")
    private String bucketName;

    @Value("${gcp.storage.base-url:https://storage.googleapis.com}")
    private String baseUrl;

    public GcsFileUploadServiceImpl(StorageConfig storageConfig, Storage storage) {
        super(storageConfig);
        this.storage = storage;
    }

    @Override
    protected String performUpload(MultipartFile file, String generatedFileName) {
        try {
            var blobId = BlobId.of(bucketName, generatedFileName);
            var blobInfo = BlobInfo.newBuilder(blobId)
                    .setContentType(file.getContentType())
                    .build();

            storage.create(blobInfo, file.getBytes());

            return String.format("%s/%s/%s", baseUrl, bucketName, generatedFileName);
        } catch (Exception ex) {
            log.error("Error uploading file {} to Google Cloud Storage", generatedFileName, ex);
            throw new FileUploadingException("Failed to upload file to GCS: " + ex.getMessage());
        }
    }

    @Override
    protected void performDelete(String fileName, String originalUrl) {
        try {
            var blobId = BlobId.of(bucketName, fileName);

            boolean deleted = storage.delete(blobId);
            if (!deleted) {
                log.warn("File {} was not found or could not be deleted from GCS", fileName);
            } else {
                log.info("Successfully deleted file {} from GCS", fileName);
            }
        } catch (Exception ex) {
            log.error("Failed to delete file from GCS. Original URL: {}", originalUrl, ex);
        }
    }
}