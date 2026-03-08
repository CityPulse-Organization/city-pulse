package city.pulse.post.helper;

import city.pulse.post.exception.ForbiddenAccessException;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;

@Component
public class UserHelper {
    public void checkUserPermissions(Long objectId, Long userId) {
        if (!objectId.equals(userId)) {
            throw new ForbiddenAccessException();
        }
    }

    public Long getUserId(Jwt jwt) {
        return Long.valueOf(jwt.getSubject());
    }
}
