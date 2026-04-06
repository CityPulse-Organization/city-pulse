package city.pulse.post.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreatePostRequest(
    @NotBlank(message = "Image URL is required")
    String imageUrl,

    @Size(max = 256, message = "Caption size must less than 256 characters long")
    String caption
) {}
