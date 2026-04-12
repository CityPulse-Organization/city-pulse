package city.pulse.post.service.impl;

import city.pulse.post.dto.PostFilterRequest;
import city.pulse.post.dto.PostResponse;
import city.pulse.post.enricher.PostEnricher;
import city.pulse.post.event.PostDeletedEvent;
import city.pulse.post.exception.PostNotFoundException;
import city.pulse.post.mapper.PostMapper;
import city.pulse.post.model.post.Post;
import city.pulse.post.repository.PostRepository;
import city.pulse.post.service.PostService;
import city.pulse.post.specification.PostSpecifications;
import city.pulse.post.validator.OwnershipValidator;
import lombok.RequiredArgsConstructor;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PostServiceImpl implements PostService {
    private final ApplicationEventPublisher eventPublisher;
    private final PostSpecifications specifications;
    private final PostRepository postRepository;
    private final OwnershipValidator validator;
    private final GeometryFactory factory;
    private final PostEnricher enricher;
    private final PostMapper mapper;


    @Override
    @Transactional(readOnly = true)
    public Page<PostResponse> getPosts(PostFilterRequest filter, UUID currentUserId, Pageable pageable) {
        var spec = specifications.getSpecification(filter, currentUserId);
        var postsPage = postRepository.findAll(spec, pageable);
        return enricher.enrichPage(postsPage, currentUserId);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PostResponse> getSavedPosts(UUID currentUserId, Pageable pageable) {
        var postsPage = postRepository.findSavedPostsByUserId(currentUserId, pageable);
        return enricher.enrichPage(postsPage, currentUserId);
    }

    @Override
    @Transactional
    public PostResponse createPost(String imageUrl, String caption, Double latitude, Double longitude, UUID userId) {
        var point = factory.createPoint(new Coordinate(longitude, latitude));;
        var post = postRepository.save(Post.create(userId, imageUrl, caption, point));
        return mapper.toDto(post, false, false);
    }

    @Override
    @Transactional(readOnly = true)
    public PostResponse getPostById(Long postId, UUID currentUserId) {
        var post = getPostEntityByIdOrThrow(postId);
        return enricher.enrichPost(post, currentUserId);
    }

    @Override
    @Transactional
    public PostResponse updatePostCaption(Long postId, UUID userId, String newCaption) {
        var post = getPostEntityByIdOrThrow(postId);
        validator.validateOwnership(post.getUserId(), userId);
        post.updateCaption(newCaption);
        var saved = postRepository.save(post);
        return enricher.enrichPost(saved, userId);
    }

    @Override
    @Transactional
    public void deletePost(Long postId, UUID userId) {
        var post = getPostEntityByIdOrThrow(postId);
        validator.validateOwnership(post.getUserId(), userId);
        postRepository.delete(post);

        eventPublisher.publishEvent(new PostDeletedEvent(post.getImageUrl(), post.getId()));
    }

    private Post getPostEntityByIdOrThrow(Long postId) {
        return postRepository.findById(postId).orElseThrow(PostNotFoundException::new);
    }
}
