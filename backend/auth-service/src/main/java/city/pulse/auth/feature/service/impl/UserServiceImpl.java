package city.pulse.auth.feature.service.impl;

import city.pulse.auth.feature.dto.RegistrationRequest;
import city.pulse.auth.feature.exception.UserAlreadyExistsException;
import city.pulse.auth.feature.mapper.UserMapper;
import city.pulse.auth.feature.oauth2.dto.OAuth2CompleteRegistrationRequest;
import city.pulse.auth.feature.oauth2.dto.OAuth2UserInfo;
import city.pulse.auth.feature.validator.UserValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import city.pulse.auth.feature.exception.UserNotFoundException;
import city.pulse.auth.feature.model.User;
import city.pulse.auth.feature.repository.UserRepository;
import city.pulse.auth.feature.service.UserService;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;
import java.util.function.Supplier;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserServiceImpl implements UserService {
    private final UserRepository repository;
    private final PasswordEncoder encoder;
    private final UserValidator validator;
    private final UserMapper mapper;

    @Override
    public User findById(Long id) {
        return repository.findById(id).orElseThrow(
                () -> new UserNotFoundException("User with such id not found")
        );
    }

    @Override
    public User findByEmail(String email) {
        return repository.findByEmail(email).orElseThrow(
                () -> new UserNotFoundException("User with such email not found")
        );
    }

    @Override
    public User findByUsername(String username) {
        return repository.findByUsername(username).orElseThrow(
                () -> new UserNotFoundException("User with such username not found")
        );
    }

    @Override
    @Transactional
    public User register(OAuth2UserInfo userInfo, OAuth2CompleteRegistrationRequest dto) {
        return register(
                dto.username(),
                userInfo.email(),
                () -> mapper.toEntity(userInfo, dto.username(), encoder.encode(UUID.randomUUID().toString()))
        );
    }

    @Override
    @Transactional
    public User register(RegistrationRequest dto) {
        return register(
                dto.username(),
                dto.email(),
                () -> mapper.toEntity(dto, encoder.encode(dto.password()))
        );
    }

    private User register(String username, String email, Supplier<User> userMapper) {
        validator.validateCreate(username, email);
        var user = userMapper.get();
        try {
            return repository.save(user);
        } catch (DataIntegrityViolationException e) {
            throw new UserAlreadyExistsException("User with such email or username already exists");
        }
    }
}