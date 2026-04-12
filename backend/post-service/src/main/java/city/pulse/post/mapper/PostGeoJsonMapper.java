package city.pulse.post.mapper;

import city.pulse.post.dto.geojson.Feature;
import city.pulse.post.dto.geojson.Geometry;
import city.pulse.post.model.post.Post;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class PostGeoJsonMapper {
    private final PostMapper mapper;

    public Feature toGeoJsonFeature(Post post, boolean isLikedByMe, boolean isSavedByMe) {
        var properties = mapper.toDto(post, isLikedByMe, isSavedByMe);

        Geometry geometry = null;
        if (post.getLocation() != null) {
            geometry = Geometry.point(post.getLocation().getX(), post.getLocation().getY());
        }

        return Feature.of(geometry, properties);
    }
}
