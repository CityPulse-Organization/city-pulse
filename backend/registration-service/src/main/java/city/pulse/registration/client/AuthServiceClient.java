package city.pulse.registration.client;

import city.pulse.registration.dto.InternalRegistrationRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.UUID;

@FeignClient(name = "auth-service-client", url = "${app.services.auth.url}")
public interface AuthServiceClient {
    @PostMapping("/internal/credentials")
    UUID createCredential(@RequestBody InternalRegistrationRequest dto);
}