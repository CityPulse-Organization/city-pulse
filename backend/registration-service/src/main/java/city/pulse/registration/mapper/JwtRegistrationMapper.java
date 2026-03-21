package city.pulse.registration.mapper;

import city.pulse.registration.dto.auth.InternalOAuth2RegistrationRequest;
import city.pulse.registration.model.AuthProvider;
import city.pulse.registration.model.Role;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;

@Component
public class JwtRegistrationMapper {
    public InternalOAuth2RegistrationRequest toOAuth2InternalRequest(Jwt jwt) {
        var email = jwt.getSubject();
        var providerId = jwt.getClaimAsString("provider_id");
        var provider = AuthProvider.valueOf(jwt.getClaimAsString("provider").toUpperCase());

        return InternalOAuth2RegistrationRequest.build(email, provider, providerId, Role.USER);
    }
}
