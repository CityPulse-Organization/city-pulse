package city.pulse.registration.service.impl;

import city.pulse.registration.client.AuthServiceClient;
import city.pulse.registration.client.UserServiceClient;
import city.pulse.registration.dto.InternalRegistrationRequest;
import city.pulse.registration.dto.LocalRegistrationRequest;
import city.pulse.registration.dto.OAuth2RegistrationRequest;
import city.pulse.registration.dto.ProfileCreationRequest;
import city.pulse.registration.mapper.JwtRegistrationMapper;
import city.pulse.registration.service.RegistrationService;
import feign.FeignException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class RegistrationServiceImpl implements RegistrationService {
    private final JwtRegistrationMapper mapper;
    private final AuthServiceClient authClient;
    private final UserServiceClient userClient;

    @Override
    public void registerLocalUser(LocalRegistrationRequest dto) {
        log.info("Starting local registration for email: {}", dto.email());
        var authRequest = InternalRegistrationRequest.forLocalUser(dto.email(), dto.password());

        executeRegistrationFlow(authRequest, dto.username());
    }

    @Override
    public void registerOAuth2User(OAuth2RegistrationRequest dto, Jwt jwt) {
        var authRequest = mapper.toOAuth2InternalRequest(jwt);
        log.info("Starting OAuth2 registration for email: {} via {}", authRequest.email(), authRequest.provider());

        executeRegistrationFlow(authRequest, dto.username());
    }

    private void executeRegistrationFlow(InternalRegistrationRequest authRequest, String username) {
        var newUserId = authClient.createCredential(authRequest);
        log.info("Successfully created credential in auth-service with ID: {}", newUserId);

        try {
            var profileRequest = new ProfileCreationRequest(newUserId, username);
            userClient.createProfile(profileRequest);
            log.info("Profile created successfully in user-service for user: {}", newUserId);
        } catch (FeignException e) {
            log.warn("External service rejected profile creation with status {}. Rolling back user {}.", e.status(), newUserId);
            safeRollback(newUserId);
            throw e;
        } catch (Exception e) {
            log.error("Unexpected error during profile creation. Rolling back user {}.", newUserId, e);
            safeRollback(newUserId);
            throw new RuntimeException("Internal error during registration", e);
        }
    }

    private void safeRollback(UUID userId) {
        try {
            authClient.deleteCredential(userId);
            log.info("Rollback successful: deleted credential {}", userId);
        } catch (Exception ex) {
            log.error("CRITICAL: Failed to rollback credential {}! Orphaned record possible.", userId, ex);
        }
    }
}
