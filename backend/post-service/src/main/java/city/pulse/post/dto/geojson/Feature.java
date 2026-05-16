package city.pulse.post.dto.geojson;

public record Feature(
        String type, // Завжди "Feature"
        Geometry geometry,
        Object properties
) {
    public static Feature of(Geometry geometry, Object properties) {
        return new Feature("Feature", geometry, properties);
    }
}
