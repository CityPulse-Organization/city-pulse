package city.pulse.post.controller;

import city.pulse.post.dto.CommentRequest;
import city.pulse.post.dto.CommentResponse;
import city.pulse.post.service.CommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import city.pulse.common.security.annotation.CurrentUser;
import city.pulse.common.security.model.UserInfo;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedModel;

@RestController
@RequiredArgsConstructor
@RequestMapping("${app.base-path}")
public class CommentController {
    private final CommentService service;

    @PostMapping("/posts/{postId}/comments")
    public ResponseEntity<CommentResponse> createComment(
            @PathVariable Long postId,
            @Valid @RequestBody CommentRequest dto,
            @CurrentUser UserInfo userInfo) {

        var created = service.createComment(postId, dto.parentId(), userInfo.id(), dto.text());

        var location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(created.id()).toUri();

        return ResponseEntity.created(location).body(created);
    }

    @GetMapping("/posts/{postId}/comments")
    public PagedModel<CommentResponse> getComments(
            @PathVariable Long postId,
            @CurrentUser UserInfo userInfo,
            Pageable pageable
    ) {
        return new PagedModel<>(service.getCommentsForPost(postId, userInfo.id(), pageable));
    }

    @GetMapping("/comments/{commentId}/replies")
    public PagedModel<CommentResponse> getReplies(
            @PathVariable Long commentId,
            @CurrentUser UserInfo userInfo,
            Pageable pageable
    ) {
        return new PagedModel<>(service.getRepliesForComment(commentId, userInfo.id(), pageable));
    }

    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<Void> deleteComment(
            @PathVariable Long commentId,
            @CurrentUser UserInfo userInfo
    ) {
        service.deleteComment(commentId, userInfo.id());
        return ResponseEntity.noContent().build();
    }
}
