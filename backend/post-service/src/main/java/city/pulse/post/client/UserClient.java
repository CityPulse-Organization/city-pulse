package city.pulse.post.client;

import city.pulse.post.client.dto.UserClientResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.UUID;

@FeignClient(name = "user-service", url = "${services.user.url}")
public interface UserClient {

    @GetMapping("/users/{userId}")
    UserClientResponse getUserById(@PathVariable("userId") UUID userId);
}
