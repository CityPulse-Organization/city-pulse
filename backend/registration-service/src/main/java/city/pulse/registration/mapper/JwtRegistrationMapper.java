package city.pulse.registration.mapper;

import city.pulse.registration.dto.InternalRegistrationRequest;
import city.pulse.registration.dto.auth.AuthProvider;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;

@Component
public class JwtRegistrationMapper {
    public InternalRegistrationRequest toOAuth2InternalRequest(Jwt jwt) {
        var email = jwt.getSubject();
        var providerId = jwt.getClaimAsString("provider_id");
        var provider = AuthProvider.valueOf(jwt.getClaimAsString("provider").toUpperCase());

        return InternalRegistrationRequest.forOAuth2User(email, provider, providerId);
    }
}
