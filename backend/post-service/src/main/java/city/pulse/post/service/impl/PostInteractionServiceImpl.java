package city.pulse.post.service.impl;

import city.pulse.post.exception.PostNotFoundException;
import city.pulse.post.model.post.PostLike;
import city.pulse.post.model.post.PostLikeId;
import city.pulse.post.model.saved.SavedPost;
import city.pulse.post.model.saved.SavedPostId;
import city.pulse.post.repository.PostLikeRepository;
import city.pulse.post.repository.PostRepository;
import city.pulse.post.repository.SavedPostRepository;
import city.pulse.post.service.PostInteractionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PostInteractionServiceImpl implements PostInteractionService {
    private final SavedPostRepository savedRepository;
    private final PostLikeRepository likeRepository;
    private final PostRepository postRepository;

    @Override
    @Transactional
    public void likePost(Long postId, UUID userId) {
        if (!postRepository.existsById(postId)) {
            throw new PostNotFoundException();
        }
        likeRepository.save(new PostLike(postId, userId));
    }

    @Override
    @Transactional
    public void unlikePost(Long postId, UUID userId) {
        if (!postRepository.existsById(postId)) {
            throw new PostNotFoundException();
        }
        likeRepository.deleteById(new PostLikeId(postId, userId));
    }

    @Override
    @Transactional
    public void savePost(Long postId, UUID userId) {
        if (!postRepository.existsById(postId)) {
            throw new PostNotFoundException();
        }
        savedRepository.save(SavedPost.builder().postId(postId).userId(userId).build());
    }

    @Override
    @Transactional
    public void unsavePost(Long postId, UUID userId) {
        if (!postRepository.existsById(postId)) {
            throw new PostNotFoundException();
        }
        savedRepository.deleteById(new SavedPostId(postId, userId));
    }
}
