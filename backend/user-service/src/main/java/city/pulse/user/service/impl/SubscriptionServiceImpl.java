package city.pulse.user.service.impl;

import city.pulse.user.dto.UserProfileResponse;
import city.pulse.user.exception.AlreadyFollowingException;
import city.pulse.user.exception.CannotFollowSelfException;
import city.pulse.user.mapper.SubscriptionMapper;
import city.pulse.user.model.Subscription;
import city.pulse.user.repository.SubscriptionRepository;
import city.pulse.user.service.SubscriptionService;
import city.pulse.user.service.UserProfileEntityService;
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
public class SubscriptionServiceImpl implements SubscriptionService {
    private final SubscriptionRepository repository;
    private final UserProfileEntityService service;
    private final SubscriptionMapper mapper;

    @Override
    @Transactional
    public void followUser(UUID subscriberId, UUID targetId) {
        if (subscriberId.equals(targetId)) {
            throw new CannotFollowSelfException("User cannot follow themselves");
        }

        var subscriber = service.findByIdOrThrow(subscriberId);
        var target = service.findByIdOrThrow(targetId);

        if (repository.existsBySubscriberAndTarget(subscriber, target)) {
            throw new AlreadyFollowingException("You are already following this user");
        }

        try {
            repository.saveAndFlush(Subscription.build(subscriber, target));
        } catch (DataIntegrityViolationException e) {
            var message = e.getMessage() != null ? e.getMessage() : "";
            if (message.contains("uq_subscription")) {
                throw new AlreadyFollowingException("You are already following this user (race condition)");
            }
            throw e;
        }

        log.info("User {} followed user {}", subscriberId, targetId);
    }

    @Override
    @Transactional
    public void unfollowUser(UUID subscriberId, UUID targetId) {
        var subscriber = service.findByIdOrThrow(subscriberId);
        var target = service.findByIdOrThrow(targetId);

        repository.deleteBySubscriberAndTarget(subscriber, target);
        log.info("User {} unfollowed user {}", subscriberId, targetId);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<UserProfileResponse> getFollowers(UUID userId, Pageable pageable) {
        var user = service.findByIdOrThrow(userId);
        return repository.findByTarget(user, pageable).map(mapper::toFollowerResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<UserProfileResponse> getFollowing(UUID userId, Pageable pageable) {
        var user = service.findByIdOrThrow(userId);
        return repository.findBySubscriber(user, pageable).map(mapper::toFollowingResponse);
    }
}
