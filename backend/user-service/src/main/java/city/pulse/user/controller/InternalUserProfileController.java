package city.pulse.user.controller;

import city.pulse.user.dto.ProfileCreationRequest;
import city.pulse.user.dto.UserProfileResponse;
import city.pulse.user.service.UserProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Set;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("${app.base-path}/internal/users")
public class InternalUserProfileController {
    private final UserProfileService service;

    @PostMapping("/profile")
    public ResponseEntity<Void> createUserProfile(@Valid @RequestBody ProfileCreationRequest dto) {
        service.createUserProfile(dto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping("/batch")
    public List<UserProfileResponse> getUsersBatch(
            @RequestBody Set<UUID> userIds
    ) {
        return service.getUserProfilesByIds(userIds);
    }
}
