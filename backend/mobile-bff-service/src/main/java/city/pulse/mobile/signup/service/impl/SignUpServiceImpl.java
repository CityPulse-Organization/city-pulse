package city.pulse.mobile.signup.service.impl;

import city.pulse.mobile.signup.client.AuthClient;
import city.pulse.mobile.signup.client.RegistrationClient;
import city.pulse.mobile.signup.dto.InternalLoginRequest;
import city.pulse.mobile.signup.dto.InternalRegisterRequest;
import city.pulse.mobile.signup.dto.MobileRegistrationRequest;
import city.pulse.mobile.signup.dto.TokenResponse;
import city.pulse.mobile.signup.service.SignUpService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SignUpServiceImpl implements SignUpService {
    private final RegistrationClient registrationClient;
    private final AuthClient authClient;

    @Override
    public TokenResponse signUp(MobileRegistrationRequest dto) {
        registrationClient.registerUser(new InternalRegisterRequest(dto.username(), dto.email(), dto.password()));
        return authClient.login(new InternalLoginRequest(dto.email(), dto.password()));
    }
}
