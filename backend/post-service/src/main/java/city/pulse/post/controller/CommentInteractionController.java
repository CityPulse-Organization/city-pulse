package city.pulse.post.controller;

import city.pulse.common.security.annotation.CurrentUser;
import city.pulse.common.security.model.UserInfo;
import city.pulse.post.service.CommentInteractionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("${app.base-path}")
public class CommentInteractionController {
    private final CommentInteractionService service;

    @PostMapping("/comments/{commentId}/like")
    public ResponseEntity<Void> likeComment(
            @PathVariable Long commentId,
            @CurrentUser UserInfo userInfo
    ) {
        service.likeComment(commentId, userInfo.id());
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/comments/{commentId}/like")
    public ResponseEntity<Void> unlikeComment(
            @PathVariable Long commentId,
            @CurrentUser UserInfo userInfo
    ) {
        service.unlikeComment(commentId, userInfo.id());
        return ResponseEntity.noContent().build();
    }
}
