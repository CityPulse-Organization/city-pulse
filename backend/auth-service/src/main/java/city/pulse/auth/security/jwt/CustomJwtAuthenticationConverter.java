package city.pulse.auth.security.jwt;

import city.pulse.auth.security.model.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@RequiredArgsConstructor
public class CustomJwtAuthenticationConverter implements Converter<Jwt, AbstractAuthenticationToken> {
    private final JwtGrantedAuthoritiesConverter converter;

    @Override
    public AbstractAuthenticationToken convert(Jwt jwt) {
        var userId = UUID.fromString(jwt.getSubject());

        var authorities = converter.convert(jwt);
        var principal = new UserPrincipal(userId, jwt.getClaimAsString("email"), authorities);

        return new UsernamePasswordAuthenticationToken(principal, jwt, authorities);
    }
}