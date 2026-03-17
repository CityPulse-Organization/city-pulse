package city.pulse.auth.controller;

import city.pulse.auth.dto.AuthRequest;
import city.pulse.auth.dto.AuthResponse;
import city.pulse.auth.dto.RefreshRequest;
import city.pulse.auth.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("${app.base-path}/auth")
public class AuthController {
    private final AuthService service;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest dto) {
        var response = service.login(dto);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(@Valid @RequestBody RefreshRequest dto) {
        var response = service.refresh(dto);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@Valid @RequestBody RefreshRequest dto) {
        service.logout(dto);
        return ResponseEntity.noContent().build();
    }
}
