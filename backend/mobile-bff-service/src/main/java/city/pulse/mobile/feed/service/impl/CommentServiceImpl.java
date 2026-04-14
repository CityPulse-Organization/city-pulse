package city.pulse.mobile.feed.service.impl;

import city.pulse.mobile.feed.client.CommentClient;
import city.pulse.mobile.feed.dto.comment.FeedCommentResponse;
import city.pulse.mobile.feed.dto.comment.CommentResponse;
import city.pulse.mobile.feed.service.CommentService;
import city.pulse.mobile.feed.util.UserEnrichmentHelper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.web.PagedModel;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {
    private final UserEnrichmentHelper enricher;
    private final CommentClient commentClient;

    @Override
    public PagedModel<FeedCommentResponse> getComments(Long postId, int page, int size, UUID userId) {
        var commentsPage = commentClient.getComments(postId, page, size, userId);

        return enricher.enrichWithUsers(
                commentsPage, page, size,
                CommentResponse::userId,
                FeedCommentResponse::from
        );
    }

    @Override
    public PagedModel<FeedCommentResponse> getReplies(Long commentId, int page, int size, UUID userId) {
        var repliesPage = commentClient.getReplies(commentId, page, size, userId);

        return enricher.enrichWithUsers(
                repliesPage, page, size,
                CommentResponse::userId,
                FeedCommentResponse::from
        );
    }
}
