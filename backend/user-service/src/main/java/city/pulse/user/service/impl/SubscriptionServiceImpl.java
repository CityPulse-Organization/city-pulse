package city.pulse.user.service.impl;

import city.pulse.user.dto.UserProfileResponse;
import city.pulse.user.exception.AlreadyFollowingException;
import city.pulse.user.exception.CannotFollowSelfException;
import city.pulse.user.exception.UserNotFoundException;
import city.pulse.user.mapper.SubscriptionMapper;
import city.pulse.user.model.Subscription;
import city.pulse.user.model.UserProfile;
import city.pulse.user.repository.SubscriptionRepository;
import city.pulse.user.repository.UserProfileRepository;
import city.pulse.user.service.SubscriptionService;
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
    private final SubscriptionRepository subscriptionRepository;
    private final UserProfileRepository userProfileRepository;
    private final SubscriptionMapper mapper;

    @Override
    @Transactional
    public void followUser(UUID subscriberId, UUID targetId) {
        if (subscriberId.equals(targetId)) {
            throw new CannotFollowSelfException("User cannot follow themselves");
        }

        var subscriber = findUserOrThrow(subscriberId);
        var target = findUserOrThrow(targetId);

        if (subscriptionRepository.existsBySubscriberAndTarget(subscriber, target)) {
            throw new AlreadyFollowingException("You are already following this user");
        }

        var subscription = Subscription.build(subscriber, target);

        try {
            subscriptionRepository.saveAndFlush(subscription);
        } catch (DataIntegrityViolationException e) {
            throw new AlreadyFollowingException("You are already following this user (race condition)");
        }

        log.info("User {} followed user {}", subscriberId, targetId);
    }

    @Override
    @Transactional
    public void unfollowUser(UUID subscriberId, UUID targetId) {
        var subscriber = findUserOrThrow(subscriberId);
        var target = findUserOrThrow(targetId);

        subscriptionRepository.deleteBySubscriberAndTarget(subscriber, target);
        log.info("User {} unfollowed user {}", subscriberId, targetId);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<UserProfileResponse> getFollowers(UUID userId, Pageable pageable) {
        var user = findUserOrThrow(userId);
        return subscriptionRepository.findByTarget(user, pageable).map(mapper::toFollowerResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<UserProfileResponse> getFollowing(UUID userId, Pageable pageable) {
        var user = findUserOrThrow(userId);
        return subscriptionRepository.findBySubscriber(user, pageable).map(mapper::toFollowingResponse);
    }

    private UserProfile findUserOrThrow(UUID userId) {
        return userProfileRepository.findById(userId).orElseThrow(
                () -> new UserNotFoundException("User not found with ID: " + userId));
    }
}
