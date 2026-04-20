package city.pulse.mobile.profile.client;

import city.pulse.mobile.feed.dto.user.UserProfileResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.UUID;

@FeignClient(name = "user-service", contextId = "profile", url = "${app.services.user.url}")
public interface UserClient {
    @GetMapping("/users/{userId}")
    UserProfileResponse getUserProfileById(@PathVariable UUID userId);
}
