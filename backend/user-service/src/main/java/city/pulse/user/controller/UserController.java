package city.pulse.user.controller;

import city.pulse.user.dto.UserProfileResponse;
import city.pulse.user.service.UserService;
import jakarta.validation.constraints.Size;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import city.pulse.common.security.annotation.CurrentUser;
import city.pulse.common.security.model.UserInfo;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("${app.base-path}/users")
public class UserController {
    private final UserService service;

    @GetMapping("/search")
    public Page<UserProfileResponse> searchUsers(
            @RequestParam(required = false) @Size(max = 32) String username,
            @CurrentUser UserInfo userInfo,
            Pageable pageable
    ) {
        return service.searchByUsername(username, userInfo.id(), pageable);
    }

    @GetMapping("/me")
    public UserProfileResponse getCurrentUser(@CurrentUser UserInfo userInfo) {
        return service.getUserById(userInfo.id());
    }

    @GetMapping("/{userId}")
    public UserProfileResponse getUserById(@PathVariable UUID userId) {
        return service.getUserById(userId);
    }
}
