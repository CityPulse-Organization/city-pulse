package city.pulse.post.service;

import city.pulse.post.dto.geojson.FeatureCollection;

public interface MapPostService {
    FeatureCollection getPostsInBoundingBox(String bbox);

    FeatureCollection getNearbyPosts(double lat, double lon, double radius);
}
