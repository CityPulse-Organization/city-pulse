package city.pulse.registration.service.impl;

import city.pulse.registration.client.AuthServiceClient;
import city.pulse.registration.dto.InternalRegistrationRequest;
import city.pulse.registration.dto.LocalRegistrationRequest;
import city.pulse.registration.dto.OAuth2RegistrationRequest;
import city.pulse.registration.dto.RegistrationResponse;
import city.pulse.registration.dto.auth.AuthProvider;
import city.pulse.registration.dto.auth.Role;
import city.pulse.registration.service.RegistrationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class RegistrationServiceImpl implements RegistrationService {
    private final AuthServiceClient authServiceClient;

    @Override
    public RegistrationResponse registerLocalUser(LocalRegistrationRequest dto) {
        log.info("Starting local registration for email: {}", dto.email());

        var authRequest = InternalRegistrationRequest.builder()
                .email(dto.email())
                .password(dto.password())
                .provider(AuthProvider.LOCAL)
                .providerId(null)
                .role(Role.USER)
                .build();

        UUID newUserId = authServiceClient.createCredential(authRequest);
        log.info("Successfully created credential in auth-service with ID: {}", newUserId);

        return RegistrationResponse.success(newUserId, dto.email());
    }

    @Override
    public RegistrationResponse registerOAuth2User(OAuth2RegistrationRequest dto, Jwt jwt) {
        String email = jwt.getSubject();
        String providerId = jwt.getClaimAsString("provider_id");
        AuthProvider provider = AuthProvider.valueOf(jwt.getClaimAsString("provider").toUpperCase());

        log.info("Completing OAuth2 registration for email: {} via {}", email, provider);

        var authRequest = InternalRegistrationRequest.builder()
                .email(email)
                .password(null)
                .provider(provider)
                .providerId(providerId)
                .role(Role.USER)
                .build();

        UUID newUserId = authServiceClient.createCredential(authRequest);
        log.info("Successfully linked OAuth2 account. User ID: {}", newUserId);

        return RegistrationResponse.success(newUserId, email);
    }
}