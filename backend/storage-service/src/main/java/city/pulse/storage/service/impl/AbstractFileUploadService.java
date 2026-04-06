package city.pulse.storage.service.impl;

import city.pulse.storage.config.StorageConfig;
import city.pulse.storage.exception.FileUploadingException;
import city.pulse.storage.service.FileUploadService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@RequiredArgsConstructor
public abstract class AbstractFileUploadService implements FileUploadService {
    private final StorageConfig config;

    @Override
    public String uploadFile(MultipartFile file) {
        validateFile(file);
        var generatedFileName = generateFileName(file.getOriginalFilename());
        return performUpload(file, generatedFileName);
    }

    @Override
    public void deleteFile(String fileUrl) {
        if (fileUrl == null || fileUrl.isBlank()) {
            return;
        }
        var fileName = extractFileNameFromUrl(fileUrl);
        performDelete(fileName, fileUrl);
    }

    private void validateFile(MultipartFile file) {
        var contentType = file.getContentType();

        if (contentType == null || !config.getAllowedFileTypes().contains(contentType.toLowerCase())) {
            throw new FileUploadingException("File upload failed: Invalid or unsupported file type.");
        }
    }

    private String generateFileName(String originalFilename) {
        return UUID.randomUUID() + "|=" + originalFilename;
    }

    private String extractFileNameFromUrl(String fileUrl) {
        return fileUrl.substring(fileUrl.lastIndexOf("/") + 1);
    }

    protected abstract String performUpload(MultipartFile file, String generatedFileName);
    protected abstract void performDelete(String fileName, String originalUrl);
}
