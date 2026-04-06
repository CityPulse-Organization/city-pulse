package city.pulse.post.model.saved;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.OffsetDateTime;
import java.util.UUID;

@Getter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@IdClass(SavedPostId.class)
@Table(name = "saved_posts")
public class SavedPost {
    @Id
    @Column(name = "post_id", nullable = false)
    private Long postId;

    @Id
    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @CreationTimestamp
    @Column(name = "saved_at", nullable = false, updatable = false)
    private OffsetDateTime savedAt;

    public static SavedPost create(Long postId, UUID userId) {
        return SavedPost.builder()
                .postId(postId)
                .userId(userId)
                .build();
    }
}
