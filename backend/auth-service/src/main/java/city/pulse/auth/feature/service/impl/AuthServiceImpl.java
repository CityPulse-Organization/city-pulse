package city.pulse.auth.feature.service.impl;

import city.pulse.auth.feature.dto.*;
import city.pulse.auth.feature.mapper.UserMapper;
import city.pulse.auth.feature.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final AuthenticationManager authenticationManager;
    private final AuthTokenService authTokenService;
    private final UserService userService;
    private final UserMapper mapper;

    @Override
    @Transactional
    public AuthResponse login(AuthRequest dto) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(dto.username(), dto.password())
        );

        var user = userService.findByUsername(dto.username());
        return authTokenService.generateTokenPair(user);
    }

    @Override
    @Transactional
    public AuthResponse refresh(RefreshTokenRequest dto) {
        return authTokenService.rotateToken(dto.token());
    }

    @Override
    @Transactional
    public void logout(RefreshTokenRequest dto) {
        authTokenService.revokeToken(dto.token());
    }

    @Override
    @Transactional
    public RegistrationResponse register(RegistrationRequest dto) {
        var user = userService.register(dto);
        return mapper.toDTO(user);
    }
}
