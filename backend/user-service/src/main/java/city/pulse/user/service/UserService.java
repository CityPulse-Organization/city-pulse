package city.pulse.user.service;

import city.pulse.user.dto.ProfileCreationRequest;
import city.pulse.user.dto.UserSearchResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface UserService {
    void createProfile(ProfileCreationRequest request);

    Page<UserSearchResponse> searchByUsername(String username, Pageable pageable);
}
