package city.pulse.post.service;

import city.pulse.post.dto.geojson.FeatureCollection;

public interface MapPostService {
    FeatureCollection getPostsInBoundingBox(double minLon, double minLat, double maxLon, double maxLat);

    FeatureCollection getNearbyPosts(double lat, double lon, double radius);
}
