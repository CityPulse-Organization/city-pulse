package city.pulse.mobile.signup.controller;

import city.pulse.mobile.signup.dto.MobileRegistrationRequest;
import city.pulse.mobile.signup.dto.TokenResponse;
import city.pulse.mobile.signup.service.SignUpService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("${app.base-path}/signup")
public class SignUpController {
    private final SignUpService service;

    @PostMapping
    public ResponseEntity<TokenResponse> signUp(@Valid @RequestBody MobileRegistrationRequest dto) {
        var tokens = service.signUp(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(tokens);
    }
}
