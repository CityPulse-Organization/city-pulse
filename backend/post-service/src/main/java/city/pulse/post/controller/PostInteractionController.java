package city.pulse.post.controller;

import city.pulse.common.security.annotation.CurrentUser;
import city.pulse.common.security.model.UserInfo;
import city.pulse.post.service.PostInteractionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("${app.base-path}/posts")
public class PostInteractionController {
    private final PostInteractionService service;

    @PostMapping("/{id}/like")
    public ResponseEntity<Void> likePost(
            @PathVariable Long id,
            @CurrentUser UserInfo userInfo
    ) {
        service.likePost(id, userInfo.id());
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}/like")
    public ResponseEntity<Void> unlikePost(
            @PathVariable Long id,
            @CurrentUser UserInfo userInfo
    ) {
        service.unlikePost(id, userInfo.id());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/save")
    public ResponseEntity<Void> savePost(
            @PathVariable Long id,
            @CurrentUser UserInfo userInfo
    ) {
        service.savePost(id, userInfo.id());
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}/save")
    public ResponseEntity<Void> unsavePost(
            @PathVariable Long id,
            @CurrentUser UserInfo userInfo
    ) {
        service.unsavePost(id, userInfo.id());
        return ResponseEntity.noContent().build();
    }
}
