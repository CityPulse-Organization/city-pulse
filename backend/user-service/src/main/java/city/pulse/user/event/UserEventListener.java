package city.pulse.user.event;

import city.pulse.user.producer.UserEventProducer;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
@RequiredArgsConstructor
public class UserEventListener {
    private final UserEventProducer producer;

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleUserDeletedEvent(UserDeletedEvent event) {
        producer.sendUserDeletedEvent(event);
    }
}
