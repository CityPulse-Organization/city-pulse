package city.pulse.user.service;

import city.pulse.user.dto.ProfileCreationRequest;

public interface UserService {
    void createProfile(ProfileCreationRequest request);
}
