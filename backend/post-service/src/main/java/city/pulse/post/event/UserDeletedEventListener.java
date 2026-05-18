package city.pulse.post.event;

import city.pulse.post.repository.CommentLikeRepository;
import city.pulse.post.repository.CommentRepository;
import city.pulse.post.repository.PostLikeRepository;
import city.pulse.post.repository.PostRepository;
import city.pulse.post.repository.SavedPostRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Component
@RequiredArgsConstructor
public class UserDeletedEventListener {
    private final PostRepository postRepository;
    private final CommentRepository commentRepository;
    private final PostLikeRepository postLikeRepository;
    private final CommentLikeRepository commentLikeRepository;
    private final SavedPostRepository savedPostRepository;

    @KafkaListener(topics = "${app.kafka.topics.user-deleted}", groupId = "${spring.kafka.consumer.group-id}")
    @Transactional
    public void handleUserDeleted(UserDeletedEvent event) {
        log.info("Received user deleted event for userId: {}", event.userId());

        try {
            savedPostRepository.deleteAllByUserId(event.userId());
            log.info("Deleted saved posts for userId: {}", event.userId());

            commentLikeRepository.deleteAllByUserId(event.userId());
            log.info("Deleted comment likes for userId: {}", event.userId());

            postLikeRepository.deleteAllByUserId(event.userId());
            log.info("Deleted post likes for userId: {}", event.userId());

            commentRepository.deleteAllByUserId(event.userId());
            log.info("Deleted comments for userId: {}", event.userId());

            postRepository.deleteAllByUserId(event.userId());
            log.info("Deleted posts for userId: {}", event.userId());

            log.info("Successfully processed user deletion for userId: {}", event.userId());
        } catch (Exception e) {
            log.error("Error processing user deleted event for userId: {}", event.userId(), e);
            throw e;
        }
    }
}
