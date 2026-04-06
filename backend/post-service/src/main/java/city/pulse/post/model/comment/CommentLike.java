package city.pulse.post.model.comment;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Getter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@IdClass(CommentLikeId.class)
@Table(name = "comment_likes")
public class CommentLike {
    @Id
    @Column(name = "comment_id", nullable = false)
    private Long commentId;

    @Id
    @Column(name = "user_id", nullable = false)
    private UUID userId;
}
