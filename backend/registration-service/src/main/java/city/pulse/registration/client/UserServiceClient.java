package city.pulse.registration.client;

import city.pulse.registration.dto.ProfileCreationRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "user-service-client", url = "${app.services.user.url}")
public interface UserServiceClient {
    @PostMapping("/internal/users/profile")
    void createProfile(@RequestBody ProfileCreationRequest dto);
}
