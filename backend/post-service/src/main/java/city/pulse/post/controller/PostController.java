package city.pulse.post.controller;

import city.pulse.post.dto.CreatePostRequest;
import city.pulse.post.dto.PostResponse;
import city.pulse.post.dto.UpdatePostRequest;
import city.pulse.post.service.PostService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import city.pulse.common.security.annotation.CurrentUser;
import city.pulse.common.security.model.UserInfo;
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

    @PostMapping
    public ResponseEntity<PostResponse> createNewPost(
            @Valid @RequestBody CreatePostRequest dto,
            @CurrentUser UserInfo userInfo) {
        var created = service.createPost(
                dto.imageUrl(),
                dto.caption(),
                userInfo.id());

        var location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(created.id()).toUri();

        return ResponseEntity.created(location).body(created);
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<Void> likePost(
            @PathVariable Long id,
            @CurrentUser UserInfo userInfo) {
        service.likePost(id, userInfo.id());
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
            @CurrentUser UserInfo userInfo) {
        return service.updatePostCaption(id, userInfo.id(), dto.caption());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(
            @PathVariable Long id,
            @CurrentUser UserInfo userInfo) {
        service.deletePost(id, userInfo.id());
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}/like")
    public ResponseEntity<Void> unlikePost(
            @PathVariable Long id,
            @CurrentUser UserInfo userInfo) {
        service.unlikePost(id, userInfo.id());
        return ResponseEntity.noContent().build();
    }
}
