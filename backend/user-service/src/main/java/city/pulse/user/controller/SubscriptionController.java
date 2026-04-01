package city.pulse.user.controller;

import city.pulse.user.dto.UserProfileResponse;
import city.pulse.user.service.SubscriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import city.pulse.common.security.annotation.CurrentUser;
import city.pulse.common.security.model.UserInfo;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("${app.base-path}/users")
public class SubscriptionController {
    private final SubscriptionService service;

    @PostMapping("/{targetId}/follow")
    public ResponseEntity<Void> follow(
            @PathVariable UUID targetId,
            @CurrentUser UserInfo userInfo) {
        var subscriberId = userInfo.id();
        service.followUser(subscriberId, targetId);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping("/{userId}/followers")
    public Page<UserProfileResponse> getFollowers(
            @PathVariable UUID userId,
            Pageable pageable) {
        return service.getFollowers(userId, pageable);
    }

    @GetMapping("/{userId}/following")
    public Page<UserProfileResponse> getFollowing(
            @PathVariable UUID userId,
            Pageable pageable) {
        return service.getFollowing(userId, pageable);
    }

    @DeleteMapping("/{targetId}/unfollow")
    public ResponseEntity<Void> unfollow(
            @PathVariable UUID targetId,
            @CurrentUser UserInfo userInfo) {
        var subscriberId = userInfo.id();
        service.unfollowUser(subscriberId, targetId);
        return ResponseEntity.noContent().build();
    }
}
