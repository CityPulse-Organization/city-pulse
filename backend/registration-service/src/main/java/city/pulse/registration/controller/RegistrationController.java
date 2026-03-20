package city.pulse.registration.controller;

import city.pulse.registration.dto.LocalRegistrationRequest;
import city.pulse.registration.dto.OAuth2RegistrationRequest;
import city.pulse.registration.service.RegistrationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("${app.api.base-path}/registration")
public class RegistrationController {
    private final RegistrationService service;

    @PostMapping("/local")
    public ResponseEntity<Void> registerLocal(@Valid @RequestBody LocalRegistrationRequest dto) {
        service.registerLocalUser(dto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping("/oauth2")
    public ResponseEntity<Void> registerOAuth2(
            @Valid @RequestBody OAuth2RegistrationRequest dto,
            @AuthenticationPrincipal Jwt jwt
    ) {
        service.registerOAuth2User(dto, jwt);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}
