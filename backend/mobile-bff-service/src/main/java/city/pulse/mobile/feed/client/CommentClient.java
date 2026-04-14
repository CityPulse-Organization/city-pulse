package city.pulse.mobile.feed.client;

import city.pulse.mobile.feed.dto.comment.CommentResponse;
import city.pulse.mobile.feed.dto.common.RestPage;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@FeignClient(name = "comment-service-client", url = "${app.services.post.url}")
public interface CommentClient {
    @GetMapping("/posts/{postId}/comments")
    RestPage<CommentResponse> getComments(
            @PathVariable Long postId,
            @RequestParam("page") int page,
            @RequestParam("size") int size,
            @RequestHeader("X-User-Id") UUID userId
    );

    @GetMapping("/comments/{commentId}/replies")
    RestPage<CommentResponse> getReplies(
            @PathVariable Long commentId,
            @RequestParam("page") int page,
            @RequestParam("size") int size,
            @RequestHeader("X-User-Id") UUID userId
    );
}
