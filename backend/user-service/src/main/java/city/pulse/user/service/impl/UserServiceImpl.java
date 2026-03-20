package city.pulse.user.service.impl;

import city.pulse.user.dto.ProfileCreationRequest;
import city.pulse.user.model.UserProfile;
import city.pulse.user.repository.UserProfileRepository;
import city.pulse.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserProfileRepository repository;

    @Override
    @Transactional
    public void createProfile(ProfileCreationRequest dto) {
        log.info("Creating profile for user ID: {}", dto.userId());

        var profile = UserProfile.build(dto.userId(), dto.username());

        repository.save(profile);
        log.info("Profile created successfully for username: {}", dto.username());
    }
}
