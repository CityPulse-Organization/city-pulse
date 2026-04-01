package city.pulse.user.dto;

import jakarta.validation.constraints.Size;
import org.hibernate.validator.constraints.URL;

public record UserProfileUpdateRequest(
        @Size(max = 512, message = "Bio must be less than 512 characters long")
        String bio,

        @Size(max = 128, message = "Job title must be less than 128 characters long")
        String jobTitle,

        @URL(message = "Avatar URL must be a valid URL")
        String avatarUrl
) {}
