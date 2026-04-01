package city.pulse.user.service.impl;

import city.pulse.user.dto.ProfileCreationRequest;
import city.pulse.user.dto.UserProfileResponse;
import city.pulse.user.exception.UserNotFoundException;
import city.pulse.user.exception.UsernameAlreadyExistsException;
import city.pulse.user.mapper.UserProfileMapper;
import city.pulse.user.model.UserProfile;
import city.pulse.user.repository.UserProfileRepository;
import city.pulse.user.service.UserService;
import city.pulse.user.specification.UserProfileSpecifications;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.UUID;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserProfileSpecifications specifications;
    private final UserProfileRepository repository;
    private final UserProfileMapper mapper;

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

    @Override
    @Transactional(readOnly = true)
    public Page<UserProfileResponse> searchByUsername(String username, UUID currentUserId, Pageable pageable) {
        var specification = specifications.getSpecification(username, currentUserId);
        return repository.findAll(specification, pageable).map(mapper::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public UserProfileResponse getUserById(UUID userId) {
        return repository.findById(userId)
                .map(mapper::toResponse)
                .orElseThrow(() -> new UserNotFoundException("User not found with ID: " + userId));
    }
}
