package city.pulse.auth.controller;

import city.pulse.auth.model.AuthProvider;
import city.pulse.auth.oauth2.dto.OAuth2LoginRequest;
import city.pulse.auth.oauth2.dto.TemporaryAuthResponse;
import city.pulse.auth.oauth2.exception.UnsupportedOAuth2ProviderException;
import city.pulse.auth.oauth2.service.OAuth2AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("${app.base-path}/oauth2")
public class OAuth2Controller {
    private final OAuth2AuthService service;

    @PostMapping("/{provider}")
    public ResponseEntity<?> loginWithOAuth2(
            @PathVariable String provider,
            @Valid @RequestBody OAuth2LoginRequest dto
    ) {
        var providerEnum = resolveProvider(provider);

        var result = service.loginWithOAuth2(providerEnum, dto);

        if (result.isRegistrationRequired()) {
            return ResponseEntity.accepted().body(new TemporaryAuthResponse(result.temporaryToken(), "REGISTRATION_REQUIRED"));
        }

        return ResponseEntity.ok(result.authResponse());
    }

    private AuthProvider resolveProvider(String provider) {
        try {
            return AuthProvider.valueOf(provider.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new UnsupportedOAuth2ProviderException(provider);
        }
    }
}
