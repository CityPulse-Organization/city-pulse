package city.pulse.user.repository;

import city.pulse.user.model.Subscription;
import city.pulse.user.model.UserProfile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {

    @EntityGraph(attributePaths = {"subscriber"})
    Page<Subscription> findByTarget(UserProfile target, Pageable pageable);

    @EntityGraph(attributePaths = {"target"})
    Page<Subscription> findBySubscriber(UserProfile subscriber, Pageable pageable);

    boolean existsBySubscriberAndTarget(UserProfile subscriber, UserProfile target);

    void deleteBySubscriberAndTarget(UserProfile subscriber, UserProfile target);
}
