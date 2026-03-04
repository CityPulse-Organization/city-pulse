package city.pulse.auth.feature.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import city.pulse.auth.feature.exception.UserNotFoundException;
import city.pulse.auth.feature.model.User;
import city.pulse.auth.feature.repository.UserRepository;
import city.pulse.auth.feature.service.UserService;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository repository;

    @Override
    public User findUserById(Long id) {
        return repository.findById(id).orElseThrow(
                () -> new UserNotFoundException("User with such id not found")
        );
    }

    @Override
    public User findUserByUsername(String username) {
        return repository.findByUsername(username).orElseThrow(
                () -> new UserNotFoundException("User with such username not found")
        );
    }
}
