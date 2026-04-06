package city.pulse.post.controller;

import city.pulse.post.dto.CreatePostRequest;
import city.pulse.post.dto.PostFilterRequest;
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

    @GetMapping
    public PagedModel<PostResponse> getPosts(
            @ModelAttribute PostFilterRequest filter,
            @CurrentUser UserInfo userInfo,
            Pageable pageable
    ) {
        return new PagedModel<>(service.getPosts(filter, userInfo.id(), pageable));
    }

    @GetMapping("/saved")
    public PagedModel<PostResponse> getSavedPosts(
            @CurrentUser UserInfo userInfo,
            Pageable pageable
    ) {
        return new PagedModel<>(service.getSavedPosts(userInfo.id(), pageable));
    }

    @GetMapping("/{id}")
    public PostResponse getPostById(
            @PathVariable Long id,
            @CurrentUser UserInfo userInfo
    ) {
        return service.getPostById(id, userInfo.id());
    }

    @PatchMapping("/{id}")
    public PostResponse updatePostCaption(
            @PathVariable Long id,
            @Valid @RequestBody UpdatePostRequest dto,
            @CurrentUser UserInfo userInfo
    ) {
        return service.updatePostCaption(id, userInfo.id(), dto.caption());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(
            @PathVariable Long id,
            @CurrentUser UserInfo userInfo
    ) {
        service.deletePost(id, userInfo.id());
        return ResponseEntity.noContent().build();
    }
}
