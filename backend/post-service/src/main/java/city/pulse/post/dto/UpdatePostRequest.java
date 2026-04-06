package city.pulse.post.dto;

import jakarta.validation.constraints.Size;

public record UpdatePostRequest(
        @Size(max = 256, message = "Caption size must less than 256 characters long")
        String caption
) {}
