package city.pulse.mobile.profile.service;

import city.pulse.mobile.feed.dto.user.UserProfileScreenResponse;

import java.util.UUID;

public interface ProfileService {
    UserProfileScreenResponse getUserProfile(UUID authorId, int page, int size, UUID userId);
}
