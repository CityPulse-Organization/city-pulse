package city.pulse.registration.client;

import city.pulse.registration.dto.auth.InternalLocalRegistrationRequest;
import city.pulse.registration.dto.auth.InternalOAuth2RegistrationRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.UUID;

@FeignClient(name = "auth-service-client", url = "${app.services.auth.url}")
public interface AuthServiceClient {
    @PostMapping("/internal/credentials/local")
    UUID createLocalCredential(@RequestBody InternalLocalRegistrationRequest dto);

    @PostMapping("/internal/credentials/oauth2")
    UUID createOAuth2Credential(@RequestBody InternalOAuth2RegistrationRequest dto);

    @DeleteMapping("/internal/credentials/{id}")
    void deleteCredential(@PathVariable UUID id);
}
