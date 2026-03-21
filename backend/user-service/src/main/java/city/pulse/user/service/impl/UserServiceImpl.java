package city.pulse.user.service.impl;

import city.pulse.user.dto.ProfileCreationRequest;
import city.pulse.user.exception.UsernameAlreadyExistsException;
import city.pulse.user.model.UserProfile;
import city.pulse.user.repository.UserProfileRepository;
import city.pulse.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
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
        var username = dto.username();
        var userId = dto.userId();

        log.info("Creating profile for user ID: {}", userId);

        if (repository.existsByUsername(username)) {
            throw new UsernameAlreadyExistsException("Username already exists");
        }

        try {
            repository.saveAndFlush(UserProfile.build(userId, username));
            log.info("Profile created successfully for username: {}", username);
        } catch (DataIntegrityViolationException e) {
            log.error("Race condition detected. Profile creation failed for user ID: {}", userId, e);
            throw new UsernameAlreadyExistsException("Username already exists (race condition detected).");
        }
    }
}
