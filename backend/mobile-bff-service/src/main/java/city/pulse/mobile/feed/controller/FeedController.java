package city.pulse.mobile.feed.controller;

import city.pulse.common.security.annotation.CurrentUser;
import city.pulse.common.security.model.UserInfo;
import city.pulse.mobile.feed.dto.FeedPostResponse;
import city.pulse.mobile.feed.dto.UserProfileScreenResponse;
import city.pulse.mobile.feed.service.FeedService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.web.PagedModel;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("${app.base-path}")
public class FeedController {
    private final FeedService service;

    @GetMapping("/feed")
    public PagedModel<FeedPostResponse> getFeed(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @CurrentUser UserInfo userInfo
    ) {
        return service.getFeed(page, size, userInfo.id());
    }

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
