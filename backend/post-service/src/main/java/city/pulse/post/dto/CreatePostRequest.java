package city.pulse.post.dto;

import jakarta.validation.constraints.NotBlank;

public record CreatePostRequest(
    @NotBlank(message = "Image URL is mandatory")
    String imageUrl,
    String caption
) {
}
