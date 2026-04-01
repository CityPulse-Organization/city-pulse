package city.pulse.user.controller;

import city.pulse.common.security.annotation.CurrentUser;
import city.pulse.common.security.model.UserInfo;
import city.pulse.user.dto.ChangeUsernameRequest;
import city.pulse.user.dto.UserProfileResponse;
import city.pulse.user.dto.UserProfileUpdateRequest;
import city.pulse.user.service.UserProfileService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Size;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("${app.base-path}/users")
public class UserProfileController {
    private final UserProfileService service;

    @GetMapping("/search")
    public Page<UserProfileResponse> searchUsers(
            @RequestParam(required = false) @Size(min = 4, max = 32) String username,
            @CurrentUser UserInfo userInfo,
            Pageable pageable
    ) {
        return service.searchByUsername(username, userInfo, pageable);
    }

    @GetMapping("/{userId}")
    public UserProfileResponse getUserProfileById(@PathVariable UUID userId) {
        return service.getUserProfileById(userId);
    }

    @GetMapping("/me")
    public UserProfileResponse getCurrentUser(@CurrentUser UserInfo userInfo) {
        return service.getUserProfileById(userInfo.id());
    }

    @PutMapping("/me")
    public UserProfileResponse updateCurrentUser(
            @Valid @RequestBody UserProfileUpdateRequest dto,
            @CurrentUser UserInfo userInfo
    ) {
        return service.updateUserProfile(dto, userInfo.id());
    }

    @PatchMapping("/me")
    public UserProfileResponse changeUsername(
            @Valid @RequestBody ChangeUsernameRequest dto,
            @CurrentUser UserInfo userInfo
    ) {
        return service.changeUsername(dto, userInfo.id());
    }
}
