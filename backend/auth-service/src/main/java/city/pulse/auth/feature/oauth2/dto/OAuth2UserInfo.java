package city.pulse.auth.feature.oauth2.dto;

public record OAuth2UserInfo(
        String email,
        String username,
        String providerId
) {}