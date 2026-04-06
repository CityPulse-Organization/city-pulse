package city.pulse.post.service.impl;

import city.pulse.post.exception.CommentNotFoundException;
import city.pulse.post.model.comment.CommentLike;
import city.pulse.post.model.comment.CommentLikeId;
import city.pulse.post.repository.CommentLikeRepository;
import city.pulse.post.repository.CommentRepository;
import city.pulse.post.service.CommentInteractionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CommentInteractionServiceImpl implements CommentInteractionService {
    private final CommentLikeRepository likeRepository;
    private final CommentRepository commentRepository;

    @Override
    @Transactional
    public void likeComment(Long commentId, UUID userId) {
        if (!commentRepository.existsById(commentId)) {
            throw new CommentNotFoundException();
        }
        likeRepository.save(new CommentLike(commentId, userId));
    }

    @Override
    @Transactional
    public void unlikeComment(Long commentId, UUID userId) {
        if (!commentRepository.existsById(commentId)) {
            throw new CommentNotFoundException();
        }
        likeRepository.deleteById(new CommentLikeId(commentId, userId));
    }
}
