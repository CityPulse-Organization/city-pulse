package city.pulse.post.validator;

import city.pulse.post.exception.ForbiddenAccessException;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class OwnershipValidator {
    public void validateOwnership(UUID resourceOwnerId, UUID currentUserId) {
        if (!resourceOwnerId.equals(currentUserId)) {
            throw new ForbiddenAccessException();
        }
    }
}
