package city.pulse.post.service.impl;

import city.pulse.post.client.StorageClient; // Наш Feign клієнт
import city.pulse.post.dto.PostResponse;
import city.pulse.post.exception.PostNotFoundException;
import city.pulse.post.helper.UserHelper;
import city.pulse.post.mapper.PostMapper;
import city.pulse.post.model.Post;
import city.pulse.post.model.PostLike;
import city.pulse.post.model.PostLikeId;
import city.pulse.post.repository.PostLikeRepository;
import city.pulse.post.repository.PostRepository;
import city.pulse.post.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PostServiceImpl implements PostService {
    private final PostRepository repository;
    private final PostLikeRepository likeRepository;
    private final PostMapper mapper;
    private final UserHelper helper;
    private final StorageClient client;

    @Override
    @Transactional
    public PostResponse createPost(String imageUrl, String caption, UUID userId) {
        var post = Post.createPost(userId, imageUrl, caption);
        return mapper.toDto(repository.save(post));
    }

    @Override
    @Transactional
    public void deletePost(Long postId, UUID userId) {
        var post = getPostEntityByIdOrThrow(postId);

        helper.checkUserPermissions(post.getUserId(), userId);

        likeRepository.deleteByPostId(postId);
        repository.delete(post);

        client.deleteFile(post.getImageUrl());
    }

    @Override
    @Transactional
    public void likePost(Long postId, UUID userId) {
        if (!repository.existsById(postId)) {
            throw new PostNotFoundException();
        }
        likeRepository.save(new PostLike(postId, userId));
    }

    @Override
    @Transactional(readOnly = true)
    public PostResponse getPostById(Long postId) {
        return mapper.toDto(getPostEntityByIdOrThrow(postId));
    }

    @Override
    public Post getPostEntityByIdOrThrow(Long postId) {
        return repository.findById(postId).orElseThrow(PostNotFoundException::new);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PostResponse> getPostsByUserId(UUID userId, Pageable pageable) {
        return repository.findByUserIdOrderByCreatedAtDesc(userId, pageable).map(mapper::toDto);
    }

    @Override
    @Transactional
    public PostResponse updatePostCaption(Long postId, UUID userId, String newCaption) {
        var post = getPostEntityByIdOrThrow(postId);
        helper.checkUserPermissions(post.getUserId(), userId);
        post.setCaption(newCaption);
        return mapper.toDto(repository.save(post));
    }

    @Override
    @Transactional
    public void unlikePost(Long postId, UUID userId) {
        if (!repository.existsById(postId)) {
            throw new PostNotFoundException();
        }
        likeRepository.deleteById(new PostLikeId(postId, userId));
    }
}
