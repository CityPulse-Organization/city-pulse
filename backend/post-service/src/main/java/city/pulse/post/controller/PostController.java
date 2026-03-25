package city.pulse.post.controller;

import city.pulse.post.dto.CreatePostRequestDTO;
import city.pulse.post.dto.PostResponseDTO;
import city.pulse.post.dto.UpdatePostRequestDTO;
import city.pulse.post.helper.UserHelper;
import city.pulse.post.service.PostService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("${app.base-path}/posts")
public class PostController {
    private final PostService service;
    private final UserHelper helper;

    @PostMapping
    public ResponseEntity<PostResponseDTO> createNewPost(
            @Valid @RequestBody CreatePostRequestDTO request,
            @AuthenticationPrincipal Jwt jwt
    ) {
        var created = service.createPost(
                request.getImageUrl(),
                request.getCaption(),
                helper.getUserId(jwt)
        );

        var location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(created.getId()).toUri();

        return ResponseEntity.created(location).body(created);
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<Void> likePost(
            @PathVariable Long id,
            @AuthenticationPrincipal Jwt jwt
    ) {
        service.likePost(id, helper.getUserId(jwt));
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}")
    public PostResponseDTO getPostById(@PathVariable Long id) {
        return service.getPostById(id);
    }

    @GetMapping("/user/{userId}")
    public List<PostResponseDTO> getPostsForUser(@PathVariable UUID userId) {
        return service.getPostsByUserId(userId);
    }

    @PatchMapping("/{id}")
    public PostResponseDTO updatePostCaption(
            @PathVariable Long id,
            @Valid @RequestBody UpdatePostRequestDTO request,
            @AuthenticationPrincipal Jwt jwt
    ) {
        return service.updatePostCaption(id, helper.getUserId(jwt), request.getCaption());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(
            @PathVariable Long id,
            @AuthenticationPrincipal Jwt jwt
    ) {
        service.deletePost(id, helper.getUserId(jwt));
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}/like")
    public ResponseEntity<Void> unlikePost(
            @PathVariable Long id,
            @AuthenticationPrincipal Jwt jwt
    ) {
        service.unlikePost(id, helper.getUserId(jwt));
        return ResponseEntity.noContent().build();
    }
}
