package city.pulse.user.controller;

import city.pulse.user.dto.ProfileCreationRequest;
import city.pulse.user.service.UserService;
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
@RequestMapping("${app.base-path}/internal/users")
public class InternalUserController {
    private final UserService service;

    @PostMapping("/profile")
    public ResponseEntity<Void> createProfile(@RequestBody @Valid ProfileCreationRequest dto) {
        service.createProfile(dto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}
