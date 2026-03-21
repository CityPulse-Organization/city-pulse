package city.pulse.auth.controller;

import city.pulse.auth.dto.InternalRegistrationRequest;
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

    @PostMapping
    public ResponseEntity<UUID> createCredential(@Valid @RequestBody InternalRegistrationRequest dto) {
        var newUserId = service.registerUser(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(newUserId);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCredential(@PathVariable UUID id) {
        service.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
