package city.pulse.post.event;

import city.pulse.post.producer.FileDeleteProducer;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
@RequiredArgsConstructor
public class FileDeleteListener {
    private final FileDeleteProducer producer;

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handlePostDeletedEvent(PostDeletedEvent event) {
        producer.sendFileDeleteRequest(event.imageUrl(), event.postId());
    }
}
