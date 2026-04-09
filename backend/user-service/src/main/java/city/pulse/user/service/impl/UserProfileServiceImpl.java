package city.pulse.user.service.impl;

import city.pulse.common.security.model.UserInfo;
import city.pulse.user.dto.ChangeUsernameRequest;
import city.pulse.user.dto.ProfileCreationRequest;
import city.pulse.user.dto.UserProfileResponse;
import city.pulse.user.dto.UserProfileUpdateRequest;
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

import java.util.List;
import java.util.Set;
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
    public List<UserProfileResponse> getUserProfilesByIds(Set<UUID> userIds) {
        if (userIds == null || userIds.isEmpty()) {
            return List.of();
        }

        return service.findAllById(userIds).stream()
                .map(mapper::toResponse)
                .toList();
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

    @Override
    @Transactional
    public UserProfileResponse updateUserProfile(UserProfileUpdateRequest dto, UUID userId) {
        var profile = service.findByIdOrThrow(userId);

        profile.updateProfile(dto.bio(), dto.jobTitle(), dto.avatarUrl());

        log.info("Profile updated for user ID: {}", userId);

        return mapper.toResponse(profile);
    }

    @Override
    @Transactional
    public UserProfileResponse changeUsername(ChangeUsernameRequest dto, UUID userId) {
        var newUsername = dto.username();
        var profile = service.findByIdOrThrow(userId);

        if (profile.getUsername().equals(newUsername)) {
            return mapper.toResponse(profile);
        }

        if (service.existsByUsername(newUsername)) {
            throw new UsernameAlreadyExistsException("Username already exists");
        }

        profile.changeUsername(newUsername);

        try {
            service.saveAndFlush(profile);
            log.info("Username successfully changed to '{}' for user ID: {}", newUsername, userId);
        } catch (DataIntegrityViolationException e) {
            log.error("Race condition detected. Username change failed for user ID: {}", userId, e);
            throw new UsernameAlreadyExistsException("Username already exists (race condition detected).");
        }

        return mapper.toResponse(profile);
    }
}
