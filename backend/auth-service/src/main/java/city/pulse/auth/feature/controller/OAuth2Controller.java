package city.pulse.auth.feature.controller;

import city.pulse.auth.feature.dto.AuthResponse;
import city.pulse.auth.feature.oauth2.dto.OAuth2CompleteRegistrationRequest;
import city.pulse.auth.feature.oauth2.dto.OAuth2LoginRequest;
import city.pulse.auth.feature.oauth2.exception.UnsupportedOAuth2ProviderException;
import city.pulse.auth.feature.oauth2.provider.OAuth2Provider;
import city.pulse.auth.feature.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("${app.base-path}/oauth2")
public class OAuth2Controller {
    private final AuthService service;

    @PostMapping("/{provider}")
    public ResponseEntity<AuthResponse> loginWithOAuth2(
            @PathVariable String provider,
            @Valid @RequestBody OAuth2LoginRequest dto
    ) {
        OAuth2Provider providerEnum;
        try {
            providerEnum = OAuth2Provider.valueOf(provider.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new UnsupportedOAuth2ProviderException(provider);
        }

        var response = service.loginWithOAuth2(providerEnum, dto);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{provider}/complete")
    public ResponseEntity<AuthResponse> completeOAuth2Registration(
            @PathVariable String provider,
            @Valid @RequestBody OAuth2CompleteRegistrationRequest dto
    ) {
        try {
            var providerEnum = OAuth2Provider.valueOf(provider.toUpperCase());
            var response = service.completeOAuth2Registration(providerEnum, dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            throw new UnsupportedOAuth2ProviderException(provider);
        }
    }
}
