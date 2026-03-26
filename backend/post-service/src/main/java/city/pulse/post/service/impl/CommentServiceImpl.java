package city.pulse.post.service.impl;

import city.pulse.post.dto.CommentResponse;
import city.pulse.post.exception.CommentNotFoundException;
import city.pulse.post.helper.UserHelper;
import city.pulse.post.mapper.CommentMapper;
import city.pulse.post.model.Comment;
import city.pulse.post.repository.CommentRepository;
import city.pulse.post.service.CommentService;
import city.pulse.post.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {
    private final CommentRepository repository;
    private final CommentMapper mapper;
    private final PostService service;
    private final UserHelper helper;

    @Override
    @Transactional
    public CommentResponse createComment(Long postId, UUID userId, String text) {
        service.getPostEntityByIdOrThrow(postId);
        var comment = Comment.builder().postId(postId).userId(userId).text(text).build();
        return mapper.toDTO(repository.save(comment));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CommentResponse> getCommentsForPost(Long postId, Pageable pageable) {
        service.getPostEntityByIdOrThrow(postId);
        return repository.findByPostIdOrderByCreatedAtAsc(postId, pageable).map(mapper::toDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public Comment getCommentEntityByIdOrThrow(Long commentId) {
        return repository.findById(commentId).orElseThrow(CommentNotFoundException::new);
    }

    @Override
    @Transactional
    public void deleteComment(Long commentId, UUID userId) {
        var comment = getCommentEntityByIdOrThrow(commentId);
        helper.checkUserPermissions(comment.getUserId(), userId);
        repository.delete(comment);
    }
}
