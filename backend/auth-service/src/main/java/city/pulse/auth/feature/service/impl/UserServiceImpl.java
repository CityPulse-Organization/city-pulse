package city.pulse.auth.feature.service.impl;

import city.pulse.auth.feature.mapper.UserMapper;
import city.pulse.auth.feature.oauth2.dto.OAuth2CompleteRegistrationRequest;
import city.pulse.auth.feature.oauth2.dto.OAuth2UserInfo;
import city.pulse.auth.feature.validator.UserValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import city.pulse.auth.feature.exception.UserNotFoundException;
import city.pulse.auth.feature.model.User;
import city.pulse.auth.feature.repository.UserRepository;
import city.pulse.auth.feature.service.UserService;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository repository;
    private final PasswordEncoder encoder;
    private final UserValidator validator;
    private final UserMapper mapper;

    @Override
    public User findUserById(Long id) {
        return repository.findById(id).orElseThrow(
                () -> new UserNotFoundException("User with such id not found")
        );
    }

    @Override
    public User findUserByEmail(String email) {
        return repository.findByEmail(email).orElseThrow(
                () -> new UserNotFoundException("User with such email not found")
        );
    }

    @Override
    public User findUserByUsername(String username) {
        return repository.findByUsername(username).orElseThrow(
                () -> new UserNotFoundException("User with such username not found")
        );
    }

    @Override
    public User registerOAuth2User(OAuth2UserInfo userInfo, OAuth2CompleteRegistrationRequest dto) {
        validator.validateCreate(dto.username(), userInfo.email());
        var user = mapper.toEntity(userInfo, dto.username(), encoder.encode(UUID.randomUUID().toString()));

        return repository.save(user);
    }
}
