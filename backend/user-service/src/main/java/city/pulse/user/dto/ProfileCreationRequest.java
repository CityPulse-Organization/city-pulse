package city.pulse.user.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public record ProfileCreationRequest(
        @NotNull(message = "User ID is required")
        UUID userId,

        @NotBlank(message = "Username is required")
        @Size(min = 4, max = 32, message = "Username must be between 4 and 32 characters long")
        String username
) {
}
