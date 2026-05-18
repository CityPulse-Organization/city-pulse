package city.pulse.post.controller;

import city.pulse.post.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("${app.base-path}/internal/posts")
public class InternalPostController {
    private final PostService service;

    @DeleteMapping("/internal/users/{userId}")
    public ResponseEntity<Void> deleteAllPostsByUser(@PathVariable UUID userId) {
        service.deleteAllUserPosts(userId);
        return ResponseEntity.noContent().build();
    }
}
