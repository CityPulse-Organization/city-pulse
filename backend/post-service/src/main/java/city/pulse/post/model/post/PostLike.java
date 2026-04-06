package city.pulse.post.model.post;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Getter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@IdClass(PostLikeId.class)
@Table(name = "post_likes")
public class PostLike {
    @Id
    @Column(name = "post_id", nullable = false)
    private Long postId;

    @Id
    @Column(name = "user_id", nullable = false)
    private UUID userId;
}
