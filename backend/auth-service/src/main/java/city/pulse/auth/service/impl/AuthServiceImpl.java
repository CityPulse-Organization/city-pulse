package city.pulse.auth.service.impl;

import city.pulse.auth.dto.AuthRequest;
import city.pulse.auth.dto.AuthResponse;
import city.pulse.auth.dto.InternalRegistrationRequest;
import city.pulse.auth.dto.RefreshRequest;
import city.pulse.auth.exception.UserAlreadyExistsException;
import city.pulse.auth.model.AuthProvider;
import city.pulse.auth.model.Credential;
import city.pulse.auth.model.LinkedAccount;
import city.pulse.auth.repository.CredentialRepository;
import city.pulse.auth.repository.LinkedAccountRepository;
import city.pulse.auth.service.AuthService;
import city.pulse.auth.service.AuthTokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@Transactional
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final LinkedAccountRepository linkedAccountRepository;
    private final CredentialRepository credentialRepository;
    private final AuthTokenService authTokenService;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional(readOnly = true)
    public AuthResponse login(AuthRequest dto) {
        return credentialRepository.findByEmail(dto.email())
                .filter(user -> user.getPasswordHash() != null)
                .filter(user -> passwordEncoder.matches(dto.password(), user.getPasswordHash()))
                .map(authTokenService::generateTokenPair)
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));
    }

    @Override
    public AuthResponse refresh(RefreshRequest dto) {
        return authTokenService.rotateToken(dto.refreshToken());
    }

    @Override
    public void logout(RefreshRequest dto) {
        authTokenService.revokeToken(dto.refreshToken());
    }

    @Override
    public UUID registerUser(InternalRegistrationRequest dto) {
        if (credentialRepository.findByEmail(dto.email()).isPresent()) {
            throw new UserAlreadyExistsException("User with email " + dto.email() + " already exists");
        }

        var hash = dto.password() != null ? passwordEncoder.encode(dto.password()) : null;
        var credential = credentialRepository.save(Credential.build(dto.email(), hash));

        if (dto.provider() != AuthProvider.LOCAL) {
            var linkedAccount = LinkedAccount.build(credential, dto.provider(), dto.providerId());
            linkedAccountRepository.save(linkedAccount);
        }

        return credential.getId();
    }

    @Override
    public void deleteUser(UUID id) {
        credentialRepository.deleteById(id);
    }
}
