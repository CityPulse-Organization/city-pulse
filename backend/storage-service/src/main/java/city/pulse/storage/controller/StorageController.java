package city.pulse.storage.controller;

import city.pulse.storage.service.FileUploadService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
@RequestMapping("${app.base-path}")
public class StorageController {
    private final FileUploadService service;

    @PostMapping(value = "/storage/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file) {
        var fileUrl = service.uploadFile(file);
        return ResponseEntity.status(HttpStatus.CREATED).body(fileUrl);
    }
}
