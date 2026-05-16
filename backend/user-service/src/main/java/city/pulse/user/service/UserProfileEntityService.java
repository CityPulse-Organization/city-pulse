package city.pulse.user.service;

import city.pulse.user.exception.UserNotFoundException;
import city.pulse.user.model.UserProfile;
import city.pulse.user.repository.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserProfileEntityService {
    private final UserProfileRepository repository;

    @Transactional
    public void saveAndFlush(UserProfile profile) {
        repository.saveAndFlush(profile);
    }

    @Transactional(readOnly = true)
    public Page<UserProfile> findBySpec(Specification<UserProfile> spec, Pageable pageable) {
        return repository.findAll(spec, pageable);
    }

    @Transactional(readOnly = true)
    public UserProfile findByIdOrThrow(UUID userId) {
        return repository.findById(userId).orElseThrow(
                () -> new UserNotFoundException("User not found with ID: " + userId)
        );
    }

    @Transactional(readOnly = true)
    public boolean existsByUsername(String username) {
        return repository.existsByUsername(username);
    }

    @Transactional(readOnly = true)
    public List<UserProfile> findAllById(Set<UUID> userIds) {
        return repository.findAllById(userIds);
    }

    @Transactional
    public void deleteById(UUID userId) {
        repository.deleteById(userId);
    }
}
