package city.pulse.post.enricher;

import city.pulse.post.dto.CommentResponse;
import city.pulse.post.mapper.CommentMapper;
import city.pulse.post.model.comment.Comment;
import city.pulse.post.repository.CommentLikeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@RequiredArgsConstructor
public class CommentEnricher {
    private final CommentLikeRepository repository;
    private final CommentMapper mapper;

    public Page<CommentResponse> enrichPage(Page<Comment> commentsPage, UUID currentUserId) {
        if (commentsPage.isEmpty()) return Page.empty(commentsPage.getPageable());

        var commentIds = commentsPage.stream().map(Comment::getId).toList();
        var likedCommentIds = repository.findLikedCommentIdsByUserIdAndCommentIds(currentUserId, commentIds);

        return commentsPage.map(comment -> mapper.toDTO(comment, likedCommentIds.contains(comment.getId())));
    }

    public CommentResponse enrichComment(Comment comment, boolean isLikedByMe) {
        return mapper.toDTO(comment, isLikedByMe);
    }
}
