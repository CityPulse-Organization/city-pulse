package city.pulse.registration.controller;

import city.pulse.registration.dto.LocalRegistrationRequest;
import city.pulse.registration.dto.OAuth2RegistrationRequest;
import city.pulse.registration.dto.RegistrationResponse;
import city.pulse.registration.service.RegistrationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("${app.api.base-path}/registration")
@RequiredArgsConstructor
public class RegistrationController {
    private final RegistrationService service;

    @PostMapping("/local")
    public ResponseEntity<RegistrationResponse> registerLocal(@Valid @RequestBody LocalRegistrationRequest dto) {
        var response = service.registerLocalUser(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/oauth2")
    public ResponseEntity<RegistrationResponse> registerOAuth2(
        @Valid @RequestBody OAuth2RegistrationRequest dto,
        @AuthenticationPrincipal Jwt jwt
    ) {
        var response = service.registerOAuth2User(dto, jwt);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
