package city.pulse.registration.mapper;

import city.pulse.registration.dto.auth.InternalOAuth2RegistrationRequest;
import city.pulse.registration.model.AuthProvider;
import city.pulse.registration.model.Role;
import com.nimbusds.jwt.SignedJWT;
import lombok.SneakyThrows;
import org.springframework.stereotype.Component;

@Component
public class TokenRegistrationMapper {
    @SneakyThrows
    public InternalOAuth2RegistrationRequest toOAuth2InternalRequest(String token) {
        var parsedJwt = SignedJWT.parse(token);
        var claims = parsedJwt.getJWTClaimsSet();

        var email = claims.getSubject();
        var providerId = claims.getStringClaim("provider_id");
        var provider = AuthProvider.valueOf(claims.getStringClaim("provider").toUpperCase());

        return InternalOAuth2RegistrationRequest.build(email, provider, providerId, Role.USER);
    }
}
