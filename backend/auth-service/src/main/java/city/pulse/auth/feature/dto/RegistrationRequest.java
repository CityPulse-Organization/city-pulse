package city.pulse.auth.feature.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegistrationRequest(
    @NotBlank(message = "Username is required")
    @Size(min = 4, max = 32, message = "Username must be between 4 and 32 characters long")
    String username,

    @NotBlank(message = "Password is required")
    @Size(min = 6, max = 32, message = "Password must be between 6 and 32 characters long")
    String password,

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be correct")
    @Size(max = 32, message = "Email must be less then 32 characters long")
    String email
) {}