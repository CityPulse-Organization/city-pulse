package city.pulse.mobile.feed.controller;

import city.pulse.common.security.annotation.CurrentUser;
import city.pulse.common.security.model.UserInfo;
import city.pulse.mobile.feed.dto.comment.FeedCommentResponse;
import city.pulse.mobile.feed.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.web.PagedModel;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("${app.base-path}")
public class CommentController {
    private final CommentService service;

    @GetMapping("/posts/{postId}/comments")
    public PagedModel<FeedCommentResponse> getComments(
            @PathVariable Long postId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @CurrentUser UserInfo userInfo
    ) {
        return service.getComments(postId, page, size, userInfo.id());
    }

    @GetMapping("/comments/{commentId}/replies")
    public PagedModel<FeedCommentResponse> getReplies(
            @PathVariable Long commentId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @CurrentUser UserInfo userInfo
    ) {
        return service.getReplies(commentId, page, size, userInfo.id());
    }
}
