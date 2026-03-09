package city.pulse.post.service.impl;

import city.pulse.post.exception.FileUploadingException;
import city.pulse.post.service.FileUploadService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.util.Set;
import java.util.UUID;

@Service
@Profile("dev")
@RequiredArgsConstructor
public class MinioFileUploadServiceImpl implements FileUploadService {
    private final S3Client s3Client;

    @Value("${storage.bucket}")
    private String bucketName;

    @Value("${storage.endpoint}")
    private String endpoint;

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
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(fileName)
                    .contentType(contentType)
                    .build();

            s3Client.putObject(putObjectRequest, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));

            return String.format("%s/%s/%s", endpoint, bucketName, fileName);

        } catch (IOException e) {
            throw new FileUploadingException("Failed to read file: " + e.getMessage());
        } catch (Exception e) {
            throw new FileUploadingException("Failed to upload file to MinIO: " + e.getMessage());
        }
    }

    @Override
    public void deleteFile(String imageUrl) {
        try {
            var fileName = imageUrl.substring(imageUrl.lastIndexOf("/") + 1);

            DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
                    .bucket(bucketName)
                    .key(fileName)
                    .build();

            s3Client.deleteObject(deleteObjectRequest);
        } catch (Exception ex) {
            System.err.println("Failed to delete file from MinIO: " + ex.getMessage());
        }
    }
}