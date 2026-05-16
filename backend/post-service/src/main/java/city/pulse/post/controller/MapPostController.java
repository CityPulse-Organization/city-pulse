package city.pulse.post.controller;

import city.pulse.post.dto.NearbyRequest;
import city.pulse.post.dto.geojson.FeatureCollection;
import city.pulse.post.service.MapPostService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Size;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@Validated
@RestController
@RequiredArgsConstructor
@RequestMapping("${app.base-path}/posts/map")
public class MapPostController {
    private final MapPostService service;

    @GetMapping("/bounds")
    public FeatureCollection getPostsWithinBounds(
            @RequestParam("bbox") @Size(min = 4, max = 4, message = "bbox must contain exactly 4 coordinates") double[] bbox
    ) {
        return service.getPostsInBoundingBox(bbox[0], bbox[1], bbox[2], bbox[3]);
    }

    @GetMapping("/nearby")
    public FeatureCollection getNearbyPosts(@Valid NearbyRequest dto) {
        return service.getNearbyPosts(dto.lat(), dto.lon(), dto.radius());
    }
}
