package city.pulse.post.service.impl;

import city.pulse.post.client.StorageClient; // Наш Feign клієнт
import city.pulse.post.dto.PostResponseDTO;
import city.pulse.post.exception.PostNotFoundException;
import city.pulse.post.helper.UserHelper;
import city.pulse.post.mapper.PostMapper;
import city.pulse.post.model.Post;
import city.pulse.post.repository.PostRepository;
import city.pulse.post.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PostServiceImpl implements PostService {
    private final PostRepository repository;
    private final PostMapper mapper;
    private final UserHelper helper;
    private final StorageClient client;

    @Override
    @Transactional
    public PostResponseDTO createPost(String imageUrl, String caption, UUID userId) {
        var post = Post.createPost(userId, imageUrl, caption);
        return mapper.toDto(repository.save(post));
    }

    @Override
    @Transactional
    public void deletePost(Long postId, UUID userId) {
        var post = getPostEntityByIdOrThrow(postId);

        helper.checkUserPermissions(post.getUserId(), userId);

        repository.delete(post);

        client.deleteFile(post.getImageUrl());
    }

    @Override
    @Transactional
    public void likePost(Long postId, UUID userId) {
        var post = getPostEntityByIdOrThrow(postId);
        post.getLikedByUsers().add(userId);
        repository.save(post);
    }

    @Override
    @Transactional(readOnly = true)
    public PostResponseDTO getPostById(Long postId) {
        return mapper.toDto(getPostEntityByIdOrThrow(postId));
    }

    @Override
    public Post getPostEntityByIdOrThrow(Long postId) {
        return repository.findById(postId).orElseThrow(PostNotFoundException::new);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PostResponseDTO> getPostsByUserId(UUID userId) {
        return repository.findByUserIdOrderByCreatedAtDesc(userId).stream().map(mapper::toDto).toList();
    }

    @Override
    @Transactional
    public PostResponseDTO updatePostCaption(Long postId, UUID userId, String newCaption) {
        var post = getPostEntityByIdOrThrow(postId);
        helper.checkUserPermissions(post.getUserId(), userId);
        post.setCaption(newCaption);
        return mapper.toDto(repository.save(post));
    }

    @Override
    @Transactional
    public void unlikePost(Long postId, UUID userId) {
        var post = getPostEntityByIdOrThrow(postId);
        post.getLikedByUsers().remove(userId);
        repository.save(post);
    }
}
