package city.pulse.user.service;

import city.pulse.common.security.model.UserInfo;
import city.pulse.user.dto.ChangeUsernameRequest;
import city.pulse.user.dto.ProfileCreationRequest;
import city.pulse.user.dto.UserProfileResponse;
import city.pulse.user.dto.UserProfileUpdateRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Set;
import java.util.UUID;

public interface UserProfileService {
    void createUserProfile(ProfileCreationRequest dto);

    List<UserProfileResponse> getUserProfilesByIds(Set<UUID> userIds);

    Page<UserProfileResponse> searchByUsername(String username, UserInfo userInfo, Pageable pageable);

    UserProfileResponse getUserProfileById(UUID userId);

    UserProfileResponse updateUserProfile(UserProfileUpdateRequest dto, UUID userId);

    UserProfileResponse changeUsername(ChangeUsernameRequest dto, UUID userId);

    void deleteUserProfile(UUID userId);
}
