package city.pulse.post.controller;

import city.pulse.post.dto.CommentRequest;
import city.pulse.post.dto.CommentResponse;
import city.pulse.post.helper.UserHelper;
import city.pulse.post.service.CommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedModel;

@RestController
@RequiredArgsConstructor
@RequestMapping("${app.base-path}")
public class CommentController {
    private final CommentService service;
    private final UserHelper helper;

    @PostMapping("/posts/{postId}/comments")
    public ResponseEntity<CommentResponse> createComment(
            @PathVariable Long postId,
            @Valid @RequestBody CommentRequest dto,
            @AuthenticationPrincipal Jwt jwt) {
        var created = service.createComment(postId, helper.getUserId(jwt), dto.text());

        var location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(created.id()).toUri();

        return ResponseEntity.created(location).body(created);
    }

    @GetMapping("/posts/{postId}/comments")
    public PagedModel<CommentResponse> getComments(
            @PathVariable Long postId,
            Pageable pageable) {
        return new PagedModel<>(service.getCommentsForPost(postId, pageable));
    }

    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<Void> deleteComment(
            @PathVariable Long commentId,
            @AuthenticationPrincipal Jwt jwt) {
        service.deleteComment(commentId, helper.getUserId(jwt));
        return ResponseEntity.noContent().build();
    }
}
