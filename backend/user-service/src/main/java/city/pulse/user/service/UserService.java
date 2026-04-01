package city.pulse.user.service;

import city.pulse.user.dto.ProfileCreationRequest;
import city.pulse.user.dto.UserProfileResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface UserService {
    void createProfile(ProfileCreationRequest request);

    Page<UserProfileResponse> searchByUsername(String username, UUID currentUserId, Pageable pageable);

    UserProfileResponse getUserById(UUID userId);
}
