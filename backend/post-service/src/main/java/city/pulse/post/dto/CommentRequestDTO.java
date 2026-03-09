package city.pulse.post.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CommentRequestDTO {
    @NotBlank(message = "Comment cannot be blank")
    @Size(min = 1, max = 256, message = "Comment must be between 1 and 256 characters long")
    private String text;
}