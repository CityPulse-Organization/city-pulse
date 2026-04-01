package city.pulse.user.service.impl;

import city.pulse.common.security.model.UserInfo;
import city.pulse.user.dto.ProfileCreationRequest;
import city.pulse.user.dto.UserProfileResponse;
import city.pulse.user.exception.UsernameAlreadyExistsException;
import city.pulse.user.mapper.UserProfileMapper;
import city.pulse.user.model.UserProfile;
import city.pulse.user.service.UserProfileEntityService;
import city.pulse.user.service.UserProfileService;
import city.pulse.user.specification.UserProfileSpecifications;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserProfileServiceImpl implements UserProfileService {
    private final UserProfileSpecifications specifications;
    private final UserProfileEntityService service;
    private final UserProfileMapper mapper;

    @Override
    @Transactional
    public void createProfile(ProfileCreationRequest dto) {
        var username = dto.username();
        var userId = dto.userId();

        log.info("Creating profile for user ID: {}", userId);

        if (service.existsByUsername(username)) {
            throw new UsernameAlreadyExistsException("Username already exists");
        }

        try {
            service.saveAndFlush(UserProfile.build(userId, username));
            log.info("Profile created successfully for username: {}", username);
        } catch (DataIntegrityViolationException e) {
            log.error("Race condition detected. Profile creation failed for user ID: {}", userId, e);
            throw new UsernameAlreadyExistsException("Username already exists (race condition detected).");
        }
    }

    @Override
    @Transactional(readOnly = true)
    public Page<UserProfileResponse> searchByUsername(String searchUsername, UserInfo userInfo, Pageable pageable) {
        var currentUsername = service.findByIdOrThrow(userInfo.id()).getUsername();
        var specification = specifications.getSpecification(searchUsername, currentUsername);
        return service.findBySpec(specification, pageable).map(mapper::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public UserProfileResponse getUserProfileById(UUID userId) {
        return mapper.toResponse(service.findByIdOrThrow(userId));
    }
}
