package city.pulse.post.service.impl;

import city.pulse.post.dto.geojson.FeatureCollection;
import city.pulse.post.model.post.Post;
import city.pulse.post.repository.PostRepository;
import city.pulse.post.mapper.PostGeoJsonMapper;
import city.pulse.post.service.MapPostService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MapPostServiceImpl implements MapPostService {
    private final PostRepository repository;
    private final PostGeoJsonMapper mapper;

    @Override
    @Transactional(readOnly = true)
    public FeatureCollection getPostsInBoundingBox(double minLon, double minLat, double maxLon, double maxLat) {
        var posts = repository.findWithinBoundingBox(minLon, minLat, maxLon, maxLat);
        return toFeatureCollection(posts);
    }

    @Override
    @Transactional(readOnly = true)
    public FeatureCollection getNearbyPosts(double lat, double lon, double radius) {
        var posts = repository.findNearby(lat, lon, radius);
        return toFeatureCollection(posts);
    }

    private FeatureCollection toFeatureCollection(List<Post> posts) {
        var features = posts.stream()
                .map(post -> {
                    boolean isLikedByMe = false;
                    boolean isSavedByMe = false;

                    return mapper.toGeoJsonFeature(post, isLikedByMe, isSavedByMe);
                })
                .toList();

        return FeatureCollection.of(features);
    }
}
