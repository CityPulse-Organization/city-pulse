package city.pulse.auth.controller;

import city.pulse.auth.dto.internal.InternalLocalRegistrationRequest;
import city.pulse.auth.dto.internal.InternalOAuth2RegistrationRequest;
import city.pulse.auth.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("${app.base-path}/internal/credentials")
public class InternalAuthController {
    private final AuthService service;

    @PostMapping("/local")
    public ResponseEntity<UUID> createLocalCredential(@Valid @RequestBody InternalLocalRegistrationRequest dto) {
        var newUserId = service.createLocalCredential(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(newUserId);
    }

    @PostMapping("/oauth2")
    public ResponseEntity<UUID> createOAuth2Credential(@Valid @RequestBody InternalOAuth2RegistrationRequest dto) {
        var newUserId = service.createOAuth2Credential(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(newUserId);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCredential(@PathVariable UUID id) {
        service.deleteCredentials(id);
        return ResponseEntity.noContent().build();
    }
}
