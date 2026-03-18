package city.pulse.auth.oauth2.dto;

import city.pulse.auth.dto.AuthResponse;

public record OAuth2LoginResult(
        boolean isRegistrationRequired,
        String temporaryToken,
        AuthResponse authResponse
) {
    public static OAuth2LoginResult success(AuthResponse authResponse) {
        return new OAuth2LoginResult(false, null, authResponse);
    }

    public static OAuth2LoginResult registrationRequired(String temporaryToken) {
        return new OAuth2LoginResult(true, temporaryToken, null);
    }
}
