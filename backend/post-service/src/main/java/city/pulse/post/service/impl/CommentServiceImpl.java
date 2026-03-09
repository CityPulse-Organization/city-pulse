package city.pulse.post.service.impl;

import city.pulse.post.dto.CommentResponseDTO;
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

import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {
    private final CommentRepository repository;
    private final CommentMapper mapper;

    private final UserHelper helper;
    private final PostService postService;

    @Override
    @Transactional
    public CommentResponseDTO createComment(Long postId, Long userId, String text) {
        postService.getPostEntityByIdOrThrow(postId);
        var comment = Comment.createComment(postId, userId, text);
        return mapper.toDTO(repository.save(comment));
    }

    @Override
    @Transactional(readOnly = true)
    public List<CommentResponseDTO> getCommentsForPost(Long postId) {
        postService.getPostEntityByIdOrThrow(postId);
        return repository.findByPostIdOrderByCreatedAtAsc(postId).stream().map(mapper::toDTO).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public Comment getCommentEntityByIdOrThrow(Long commentId) {
        return repository.findById(commentId).orElseThrow(CommentNotFoundException::new);
    }

    @Override
    @Transactional
    public void deleteComment(Long commentId, Long userId) {
        var comment = getCommentEntityByIdOrThrow(commentId);
        helper.checkUserPermissions(comment.getUserId(), userId);
        repository.delete(comment);
    }
}