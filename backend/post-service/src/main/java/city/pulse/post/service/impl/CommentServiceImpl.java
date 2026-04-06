package city.pulse.post.service.impl;

import city.pulse.post.dto.CommentResponse;
import city.pulse.post.enricher.CommentEnricher;
import city.pulse.post.exception.CommentNotFoundException;
import city.pulse.post.model.comment.Comment;
import city.pulse.post.repository.CommentRepository;
import city.pulse.post.service.CommentService;
import city.pulse.post.service.PostService;
import city.pulse.post.validator.OwnershipValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {
    private final CommentRepository commentRepository;
    private final OwnershipValidator validator;
    private final CommentEnricher enricher;
    private final PostService postService;

    @Override
    @Transactional
    public CommentResponse createComment(Long postId, Long parentId, UUID userId, String text) {
        postService.getPostById(postId, userId);

        if (parentId != null) {
            var parentComment = getCommentEntityByIdOrThrow(parentId);
            if (!parentComment.getPostId().equals(postId)) {
                throw new IllegalArgumentException("Parent comment does not belong to this post");
            }
        }

        var comment = commentRepository.save(Comment.createComment(postId, parentId, userId, text));
        return enricher.enrichComment(comment, false);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CommentResponse> getCommentsForPost(Long postId, UUID currentUserId, Pageable pageable) {
        postService.getPostById(postId, currentUserId);
        var commentsPage = commentRepository.findRootComments(postId, pageable);
        return enricher.enrichPage(commentsPage, currentUserId);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CommentResponse> getRepliesForComment(Long commentId, UUID currentUserId, Pageable pageable) {
        getCommentEntityByIdOrThrow(commentId);
        var repliesPage = commentRepository.findReplies(commentId, pageable);
        return enricher.enrichPage(repliesPage, currentUserId);
    }

    @Override
    @Transactional
    public void deleteComment(Long commentId, UUID userId) {
        var comment = getCommentEntityByIdOrThrow(commentId);
        validator.validateOwnership(comment.getUserId(), userId);

        commentRepository.delete(comment);
    }

    private Comment getCommentEntityByIdOrThrow(Long commentId) {
        return commentRepository.findById(commentId).orElseThrow(CommentNotFoundException::new);
    }
}
