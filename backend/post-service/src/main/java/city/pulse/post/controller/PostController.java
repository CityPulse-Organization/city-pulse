package city.pulse.post.controller;

import city.pulse.post.dto.PostResponseDTO;
import city.pulse.post.helper.UserHelper;
import city.pulse.post.dto.UpdatePostRequestDTO;
import city.pulse.post.service.PostService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("${app.base-path}/posts")
public class PostController {
    private final PostService postService;
    private final UserHelper helper;

    @PostMapping
    public ResponseEntity<PostResponseDTO> createNewPost(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "caption", required = false) String caption,
            @AuthenticationPrincipal Jwt jwt
    ) {
        var created = postService.createPost(file, caption, helper.getUserId(jwt));

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
        postService.likePost(id, helper.getUserId(jwt));
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}")
    public PostResponseDTO getPostById(@PathVariable Long id) {
        return postService.getPostById(id);
    }

    @GetMapping("/user/{userId}")
    public List<PostResponseDTO> getPostsForUser(@PathVariable Long userId) {
        return postService.getPostsByUserId(userId);
    }

    @PatchMapping("/{id}")
    public PostResponseDTO updatePostCaption(
            @PathVariable Long id,
            @Valid @RequestBody UpdatePostRequestDTO request,
            @AuthenticationPrincipal Jwt jwt
    ) {
        return postService.updatePostCaption(id, helper.getUserId(jwt), request.getCaption());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(
            @PathVariable Long id,
            @AuthenticationPrincipal Jwt jwt
    ) {
        postService.deletePost(id, helper.getUserId(jwt));
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}/like")
    public ResponseEntity<Void> unlikePost(
            @PathVariable Long id,
            @AuthenticationPrincipal Jwt jwt
    ) {
        postService.unlikePost(id, helper.getUserId(jwt));
        return ResponseEntity.noContent().build();
    }
}