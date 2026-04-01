package city.pulse.mobile.signup.client;

import city.pulse.mobile.signup.dto.InternalRegisterRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "registration-service", url = "${app.services.registration.url}")
public interface RegistrationClient {
    @PostMapping("/registration/local")
    void registerUser(@RequestBody InternalRegisterRequest dto);
}
