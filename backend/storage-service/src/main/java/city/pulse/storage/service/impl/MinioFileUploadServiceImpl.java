package city.pulse.storage.service.impl;

import city.pulse.storage.config.StorageConfig;
import city.pulse.storage.exception.FileUploadingException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;

@Slf4j
@Service
@Profile("dev")
public class MinioFileUploadServiceImpl extends AbstractFileUploadService {
    private final S3Client s3Client;

    @Value("${storage.bucket}")
    private String bucketName;

    @Value("${storage.endpoint}")
    private String endpoint;

    public MinioFileUploadServiceImpl(StorageConfig storageConfig, S3Client s3Client) {
        super(storageConfig);
        this.s3Client = s3Client;
    }

    @Override
    protected String performUpload(MultipartFile file, String generatedFileName) {
        try {
            var putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(generatedFileName)
                    .contentType(file.getContentType())
                    .build();

            s3Client.putObject(putObjectRequest, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));

            return String.format("%s/%s/%s", endpoint, bucketName, generatedFileName);

        } catch (IOException e) {
            log.error("Failed to read file input stream for MinIO upload: {}", generatedFileName, e);
            throw new FileUploadingException("Failed to read file: " + e.getMessage());
        } catch (Exception e) {
            log.error("Failed to upload file to MinIO: {}", generatedFileName, e);
            throw new FileUploadingException("Failed to upload file to MinIO: " + e.getMessage());
        }
    }

    @Override
    protected void performDelete(String fileName, String originalUrl) {
        try {
            var deleteObjectRequest = DeleteObjectRequest.builder()
                    .bucket(bucketName)
                    .key(fileName)
                    .build();

            s3Client.deleteObject(deleteObjectRequest);
            log.info("Successfully deleted file {} from MinIO", fileName);
        } catch (Exception ex) {
            log.error("Failed to delete file {} from MinIO. Original URL: {}", fileName, originalUrl, ex);
        }
    }
}
