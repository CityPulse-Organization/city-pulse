package city.pulse.post.service.impl;

import city.pulse.post.dto.PostResponseDTO;
import city.pulse.post.exception.PostNotFoundException;
import city.pulse.post.helper.UserHelper;
import city.pulse.post.mapper.PostMapper;
import city.pulse.post.model.Post;
import city.pulse.post.repository.PostRepository;
import city.pulse.post.service.FileUploadService;
import city.pulse.post.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PostServiceImpl implements PostService {
    private final PostRepository repository;
    private final PostMapper mapper;

    private final UserHelper helper;
    private final FileUploadService service;

    @Override
    @Transactional
    public PostResponseDTO createPost(MultipartFile file, String caption, Long userId) {
        var imageUrl = service.uploadFile(file);
        var post = Post.createPost(userId, imageUrl, caption);
        return mapper.toDto(repository.save(post));
    }

    @Override
    @Transactional
    public void likePost(Long postId, Long userId) {
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
    public List<PostResponseDTO> getPostsByUserId(Long userId) {
        return repository.findByUserIdOrderByCreatedAtDesc(userId).stream().map(mapper::toDto).toList();
    }

    @Override
    @Transactional
    public PostResponseDTO updatePostCaption(Long postId, Long userId, String newCaption) {
        var post = getPostEntityByIdOrThrow(postId);

        helper.checkUserPermissions(post.getUserId(), userId);

        post.setCaption(newCaption);
        return mapper.toDto(repository.save(post));
    }

    @Override
    @Transactional
    public void deletePost(Long postId, Long userId) {
        var post = getPostEntityByIdOrThrow(postId);

        helper.checkUserPermissions(post.getUserId(), userId);

        repository.delete(post);
        service.deleteFile(post.getImageUrl());
    }

    @Override
    @Transactional
    public void unlikePost(Long postId, Long userId) {
        var post = getPostEntityByIdOrThrow(postId);
        post.getLikedByUsers().remove(userId);
        repository.save(post);
    }
}