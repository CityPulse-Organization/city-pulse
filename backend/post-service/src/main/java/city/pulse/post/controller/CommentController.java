package city.pulse.post.controller;

import city.pulse.post.dto.CommentRequestDTO;
import city.pulse.post.dto.CommentResponseDTO;
import city.pulse.post.helper.UserHelper;
import city.pulse.post.service.CommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("${app.base-path}")
public class CommentController {
    private final CommentService commentService;
    private final UserHelper helper;

    @PostMapping("/posts/{postId}/comments")
    public ResponseEntity<CommentResponseDTO> createComment(
            @PathVariable Long postId,
            @Valid @RequestBody CommentRequestDTO request,
            @AuthenticationPrincipal Jwt jwt
    ) {
        var created = commentService.createComment(postId, helper.getUserId(jwt), request.getText());

        var location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(created.getId()).toUri();

        return ResponseEntity.created(location).body(created);
    }

    @GetMapping("/posts/{postId}/comments")
    public List<CommentResponseDTO> getComments(@PathVariable Long postId) {
        return commentService.getCommentsForPost(postId);
    }

    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<Void> deleteComment(
            @PathVariable Long commentId,
            @AuthenticationPrincipal Jwt jwt
    ) {
        commentService.deleteComment(commentId, helper.getUserId(jwt));
        return ResponseEntity.noContent().build();
    }
}