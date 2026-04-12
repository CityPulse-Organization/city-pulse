package city.pulse.post.controller;

import city.pulse.post.dto.geojson.FeatureCollection;
import city.pulse.post.service.MapPostService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("${app.base-path}/posts/map")
public class MapPostController {
    private final MapPostService service;

    @GetMapping("/bounds")
    public FeatureCollection getPostsWithinBounds(@RequestParam("bbox") String bbox) {
        return service.getPostsInBoundingBox(bbox);
    }

    @GetMapping("/nearby")
    public FeatureCollection getNearbyPosts(
            @RequestParam("lat") double lat,
            @RequestParam("lon") double lon,
            @RequestParam("radius") double radius
    ) {
        return service.getNearbyPosts(lat, lon, radius);
    }
}
