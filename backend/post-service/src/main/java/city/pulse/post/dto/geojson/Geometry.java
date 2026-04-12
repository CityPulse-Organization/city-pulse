package city.pulse.post.dto.geojson;

public record Geometry(
        String type,
        double[] coordinates
) {
    public static Geometry point(double longitude, double latitude) {
        return new Geometry("Point", new double[]{longitude, latitude});
    }
}
