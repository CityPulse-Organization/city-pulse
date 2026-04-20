package city.pulse.mobile.feed.client;

import city.pulse.mobile.feed.dto.user.UserProfileResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.Set;
import java.util.UUID;

@FeignClient(name = "user-service", contextId = "users", url = "${app.services.user.url}")
public interface UserClient {
    @PostMapping("/internal/users/batch")
    List<UserProfileResponse> getUsersBatch(@RequestBody Set<UUID> userIds);
}
