package city.pulse.post.dto.geojson;

import java.util.List;

public record FeatureCollection(
        String type,
        List<Feature> features
) {
    public static FeatureCollection of(List<Feature> features) {
        return new FeatureCollection("FeatureCollection", features);
    }
}
