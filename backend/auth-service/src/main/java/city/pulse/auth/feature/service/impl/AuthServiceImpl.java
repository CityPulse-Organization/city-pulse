package city.pulse.auth.feature.service.impl;

import city.pulse.auth.feature.dto.*;
import city.pulse.auth.feature.exception.UserAlreadyExistsException;
import city.pulse.auth.feature.exception.UserNotFoundException;
import city.pulse.auth.feature.mapper.UserMapper;
import city.pulse.auth.feature.oauth2.dto.OAuth2CompleteRegistrationRequest;
import city.pulse.auth.feature.oauth2.dto.OAuth2LoginRequest;
import city.pulse.auth.feature.oauth2.exception.OAuth2RegistrationRequiredException;
import city.pulse.auth.feature.oauth2.factory.OAuth2StrategyFactory;
import city.pulse.auth.feature.oauth2.provider.OAuth2Provider;
import city.pulse.auth.feature.repository.UserRepository;
import city.pulse.auth.feature.service.AuthService;
import city.pulse.auth.feature.service.JwtService;
import city.pulse.auth.feature.service.RefreshTokenService;
import city.pulse.auth.feature.service.UserService;
import city.pulse.auth.feature.validator.UserValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final AuthenticationManager authenticationManager;
    private final RefreshTokenService refreshTokenService;
    private final OAuth2StrategyFactory factory;
    private final UserService userService;
    private final JwtService jwtService;

    private final UserRepository repository;
    private final UserValidator validator;
    private final UserMapper mapper;
    private final PasswordEncoder encoder;

    @Override
    public AuthResponse login(AuthRequest dto) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(dto.username(), dto.password())
        );

        var user = userService.findUserByUsername(dto.username());

        var access = jwtService.createAccessToken(user.getId(), user.getRole());
        var refresh = refreshTokenService.issue(user);

        return new AuthResponse(access, refresh);
    }

    @Override
    public AuthResponse refresh(RefreshTokenRequest dto) {
        var token = refreshTokenService.validateActive(dto.token());
        var user = token.getUser();

        var newAccess = jwtService.createAccessToken(user.getId(), user.getRole());
        var newRefresh = refreshTokenService.rotate(token);

        return new AuthResponse(newAccess, newRefresh);
    }

    @Override
    public void logout(RefreshTokenRequest dto) {
        var token = refreshTokenService.validateActive(dto.token());
        refreshTokenService.revokeById(token.getId());
    }

    @Override
    @Transactional
    public RegistrationResponse createUser(RegistrationRequest dto) {
        validator.validateCreate(dto.username(), dto.email());

        var encodedPassword = encoder.encode(dto.password());
        var user = mapper.toEntity(dto,encodedPassword);

        try {
            var saved = repository.save(user);
            return mapper.toDTO(saved);
        } catch (DataIntegrityViolationException e) {
            throw new UserAlreadyExistsException("A user with given credentials already exists");
        }
    }

    @Override
    @Transactional
    public AuthResponse loginWithOAuth2(OAuth2Provider provider, OAuth2LoginRequest dto) {
        var strategy = factory.getStrategy(provider);
        var userInfo = strategy.validateAndExtract(dto.token());

        try {
            var user = userService.findUserByEmail(userInfo.email());

            var access = jwtService.createAccessToken(user.getId(), user.getRole());
            var refresh = refreshTokenService.issue(user);

            return new AuthResponse(access, refresh);
        } catch (UserNotFoundException e) {
            throw new OAuth2RegistrationRequiredException(
                    "User not found. Please provide a username.",
                    userInfo.email(),
                    provider
            );
        }
    }

    @Override
    @Transactional
    public AuthResponse completeOAuth2Registration(OAuth2Provider provider, OAuth2CompleteRegistrationRequest dto) {
        var strategy = factory.getStrategy(provider);
        var userInfo = strategy.validateAndExtract(dto.token());

        var user = userService.registerOAuth2User(userInfo, dto);

        var access = jwtService.createAccessToken(user.getId(), user.getRole());
        var refresh = refreshTokenService.issue(user);

        return new AuthResponse(access, refresh);
    }
}
