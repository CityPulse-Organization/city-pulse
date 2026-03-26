package city.pulse.post.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "storage-service", url = "${services.storage.url}")
public interface StorageClient {
    @DeleteMapping("/internal/storage/delete")
    void deleteFile(@RequestParam("fileUrl") String fileUrl);
}
