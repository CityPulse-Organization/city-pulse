package city.pulse.post.repository;

import city.pulse.post.model.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.UUID;

public interface PostRepository extends JpaRepository<Post, Long> {
    Page<Post> findByUserIdOrderByCreatedAtDesc(UUID userId, Pageable pageable);

    Page<Post> findByCaptionContainingIgnoreCaseOrderByCreatedAtDesc(String caption, Pageable pageable);

    Page<Post> findByCreatedAtAfterOrderByCreatedAtDesc(LocalDateTime after, Pageable pageable);

    Page<Post> findByCaptionContainingIgnoreCaseAndCreatedAtAfterOrderByCreatedAtDesc(String caption, LocalDateTime after, Pageable pageable);

    Page<Post> findAllByOrderByCreatedAtDesc(Pageable pageable);
}
