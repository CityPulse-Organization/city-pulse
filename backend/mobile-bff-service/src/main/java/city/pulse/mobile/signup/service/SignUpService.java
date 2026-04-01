package city.pulse.mobile.signup.service;

import city.pulse.mobile.signup.dto.MobileRegistrationRequest;
import city.pulse.mobile.signup.dto.TokenResponse;

public interface SignUpService {
    TokenResponse signUp(MobileRegistrationRequest dto);
}
