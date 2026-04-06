package city.pulse.post.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CommentRequest(
        @NotBlank(message = "Comment is required")
        @Size(min = 1, max = 256, message = "Comment must be between 1 and 256 characters long")
        String text,

        Long parentId
) {}
