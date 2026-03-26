package city.pulse.post.controller;

import city.pulse.post.dto.CreatePostRequest;
import city.pulse.post.dto.PostResponse;
import city.pulse.post.dto.UpdatePostRequest;
import city.pulse.post.helper.UserHelper;
import city.pulse.post.service.PostService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedModel;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("${app.base-path}/posts")
public class PostController {
    private final PostService service;
    private final UserHelper helper;

    @PostMapping
    public ResponseEntity<PostResponse> createNewPost(
            @Valid @RequestBody CreatePostRequest dto,
            @AuthenticationPrincipal Jwt jwt) {
        var created = service.createPost(
                dto.imageUrl(),
                dto.caption(),
                helper.getUserId(jwt));

        var location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(created.id()).toUri();

        return ResponseEntity.created(location).body(created);
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<Void> likePost(
            @PathVariable Long id,
            @AuthenticationPrincipal Jwt jwt) {
        service.likePost(id, helper.getUserId(jwt));
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}")
    public PostResponse getPostById(@PathVariable Long id) {
        return service.getPostById(id);
    }

    @GetMapping("/user/{userId}")
    public PagedModel<PostResponse> getPostsForUser(
            @PathVariable UUID userId,
            Pageable pageable) {
        return new PagedModel<>(service.getPostsByUserId(userId, pageable));
    }

    @PatchMapping("/{id}")
    public PostResponse updatePostCaption(
            @PathVariable Long id,
            @Valid @RequestBody UpdatePostRequest dto,
            @AuthenticationPrincipal Jwt jwt) {
        return service.updatePostCaption(id, helper.getUserId(jwt), dto.caption());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(
            @PathVariable Long id,
            @AuthenticationPrincipal Jwt jwt) {
        service.deletePost(id, helper.getUserId(jwt));
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}/like")
    public ResponseEntity<Void> unlikePost(
            @PathVariable Long id,
            @AuthenticationPrincipal Jwt jwt) {
        service.unlikePost(id, helper.getUserId(jwt));
        return ResponseEntity.noContent().build();
    }
}
