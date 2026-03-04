package city.pulse.auth.feature.validator;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import city.pulse.auth.feature.exception.UserAlreadyExistsException;
import city.pulse.auth.feature.repository.UserRepository;

@Component
@RequiredArgsConstructor
public class UserValidator {
    private final UserRepository repository;

    public void validateCreate(String username, String email) {
        if (repository.existsByUsername(username)) {
            throw new UserAlreadyExistsException("User with such username already exists");
        }
        if (repository.existsByEmail(email)) {
            throw new UserAlreadyExistsException("User with such email already exists");
        }
    }
}
