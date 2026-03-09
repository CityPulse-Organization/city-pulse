package city.pulse.post.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdatePostRequestDTO {
    @NotBlank(message = "Caption cannot be black")
    @Size(min = 1, max = 64, message = "Caption size must be between 1 and 64 characters long")
    private String caption;
}