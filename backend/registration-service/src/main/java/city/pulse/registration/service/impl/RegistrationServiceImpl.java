package city.pulse.registration.service.impl;

import city.pulse.registration.client.AuthServiceClient;
import city.pulse.registration.dto.InternalRegistrationRequest;
import city.pulse.registration.dto.LocalRegistrationRequest;
import city.pulse.registration.dto.OAuth2RegistrationRequest;
import city.pulse.registration.dto.RegistrationResponse;
import city.pulse.registration.mapper.JwtRegistrationMapper;
import city.pulse.registration.service.RegistrationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class RegistrationServiceImpl implements RegistrationService {
    private final JwtRegistrationMapper mapper;
    private final AuthServiceClient client;

    @Override
    public RegistrationResponse registerLocalUser(LocalRegistrationRequest dto) {
        log.info("Starting local registration for email: {}", dto.email());

        var authRequest = InternalRegistrationRequest.forLocalUser(dto.email(), dto.password());

        var newUserId = client.createCredential(authRequest);
        log.info("Successfully created credential in auth-service with ID: {}", newUserId);

        return new RegistrationResponse(newUserId, dto.email());
    }

    @Override
    public RegistrationResponse registerOAuth2User(OAuth2RegistrationRequest dto, Jwt jwt) {
        var request = mapper.toInternalRequest(jwt);

        log.info("Completing OAuth2 registration for email: {} via {}", request.email(), request.provider());

        var newUserId = client.createCredential(request);
        log.info("Successfully linked OAuth2 account. User ID: {}", newUserId);

        return new RegistrationResponse(newUserId, request.email());
    }
}
