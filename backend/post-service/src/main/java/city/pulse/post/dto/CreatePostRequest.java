package city.pulse.post.dto;

import jakarta.validation.constraints.*;

public record CreatePostRequest(
    @NotBlank(message = "Image URL is required")
    String imageUrl,

    @Size(max = 256, message = "Caption size must less than 256 characters long")
    String caption,

    @NotNull(message = "Latitude is required")
    @Max(value = 90, message = "Latitude must be valid")
    @Min(value = -90, message = "Latitude must be valid")
    Double latitude,

    @NotNull(message = "Longitude is required")
    @Max(value = 180, message = "Longitude must be valid")
    @Min(value = -180, message = "Longitude must be valid")
    Double longitude
) {}
