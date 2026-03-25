package city.pulse.post.helper;

import city.pulse.post.exception.ForbiddenAccessException;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class UserHelper {
    public void checkUserPermissions(UUID objectId, UUID userId) {
        if (!objectId.equals(userId)) {
            throw new ForbiddenAccessException();
        }
    }

    public UUID getUserId(Jwt jwt) {
        return UUID.fromString(jwt.getSubject());
    }
}
