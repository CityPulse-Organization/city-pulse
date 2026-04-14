package city.pulse.mobile.feed.client;

import city.pulse.mobile.feed.dto.post.PostResponse;
import city.pulse.mobile.feed.dto.common.RestPage;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.UUID;

@FeignClient(name = "post-service", url = "${app.services.post.url}")
public interface PostClient {
    @GetMapping("/posts")
    RestPage<PostResponse> getPosts(
            @RequestParam("page") int page,
            @RequestParam("size") int size,
            @RequestParam(value = "authorId", required = false) UUID authorId,
            @RequestHeader("X-User-Id") UUID userId
    );
}
