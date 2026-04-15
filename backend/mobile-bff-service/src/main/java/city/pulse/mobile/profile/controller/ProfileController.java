package city.pulse.mobile.profile.controller;

import city.pulse.common.security.annotation.CurrentUser;
import city.pulse.common.security.model.UserInfo;
import city.pulse.mobile.feed.dto.user.UserProfileScreenResponse;
import city.pulse.mobile.profile.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("${app.base-path}")
public class ProfileController {
    private final ProfileService service;

    @GetMapping("/users/{authorId}/profile")
    public UserProfileScreenResponse getUserProfile(
            @PathVariable UUID authorId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @CurrentUser UserInfo userInfo
    ) {
        return service.getUserProfile(authorId, page, size, userInfo.id());
    }
}
