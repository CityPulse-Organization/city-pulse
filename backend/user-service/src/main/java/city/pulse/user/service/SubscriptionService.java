package city.pulse.user.service;

import city.pulse.user.dto.UserProfileResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface SubscriptionService {
    void followUser(UUID subscriberId, UUID targetId);

    void unfollowUser(UUID subscriberId, UUID targetId);

    Page<UserProfileResponse> getFollowers(UUID userId, Pageable pageable);

    Page<UserProfileResponse> getFollowing(UUID userId, Pageable pageable);
}
