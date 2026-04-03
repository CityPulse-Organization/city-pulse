package city.pulse.mobile.signup.client;

import city.pulse.mobile.signup.dto.InternalLoginRequest;
import city.pulse.mobile.signup.dto.TokenResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "auth-service", url = "${app.services.auth.url}")
public interface AuthClient {
    @PostMapping("/auth/login")
    TokenResponse login(@RequestBody InternalLoginRequest dto);
}
