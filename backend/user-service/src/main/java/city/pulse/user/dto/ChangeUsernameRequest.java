package city.pulse.user.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ChangeUsernameRequest(
        @NotBlank(message = "Username is required")
        @Size(min = 4, max = 32, message = "Username must be between 4 and 32 characters long")
        String username
) {}
