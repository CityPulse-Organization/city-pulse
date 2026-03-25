package city.pulse.post.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreatePostRequestDTO {
    @NotBlank(message = "Image URL is mandatory")
    private String imageUrl;

    private String caption;
}