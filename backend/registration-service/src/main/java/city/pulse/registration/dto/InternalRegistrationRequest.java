package city.pulse.registration.dto;

import city.pulse.registration.dto.auth.AuthProvider;
import city.pulse.registration.dto.auth.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InternalRegistrationRequest {
    private String email;
    private String password;
    private AuthProvider provider;
    private String providerId;
    private Role role;
}