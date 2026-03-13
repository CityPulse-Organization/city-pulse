package city.pulse.auth.feature.security.jwt;

import city.pulse.auth.feature.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CustomJwtAuthenticationConverter implements Converter<Jwt, AbstractAuthenticationToken> {
    private final JwtGrantedAuthoritiesConverter converter;
    private final UserService service;

    @Override
    public AbstractAuthenticationToken convert(Jwt jwt) {
        var id = Long.valueOf(jwt.getSubject());
        var user = service.findById(id);

        return new UsernamePasswordAuthenticationToken(user, jwt, converter.convert(jwt));
    }
}