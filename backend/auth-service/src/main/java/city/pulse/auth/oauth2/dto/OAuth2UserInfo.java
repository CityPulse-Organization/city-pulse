package city.pulse.auth.oauth2.dto;

public record OAuth2UserInfo(
        String providerId,
        String email,
        boolean isEmailVerified
) {}
