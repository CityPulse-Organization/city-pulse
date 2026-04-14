package city.pulse.mobile.feed.service;
import city.pulse.mobile.feed.dto.comment.FeedCommentResponse;
import org.springframework.data.web.PagedModel;

import java.util.UUID;

public interface CommentService {
    PagedModel<FeedCommentResponse> getComments(Long postId, int page, int size, UUID userId);

    PagedModel<FeedCommentResponse> getReplies(Long commentId, int page, int size, UUID userId);
}
