package city.pulse.post.model.comment;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.Formula;

import java.time.OffsetDateTime;
import java.util.UUID;

@Getter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "comments")
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "parent_id")
    private Long parentId;

    @Column(name = "post_id", nullable = false, updatable = false)
    private Long postId;

    @Column(name = "user_id", nullable = false, updatable = false)
    private UUID userId;

    @Column(name = "text", nullable = false, length = 256)
    private String text;

    @Builder.Default
    @Formula("(SELECT count(*) FROM comment_likes cl WHERE cl.comment_id = id)")
    private int likeCount = 0;

    @Builder.Default
    @Formula("(SELECT count(*) FROM comments c WHERE c.parent_id = id)")
    private int replyCount = 0;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    public static Comment createComment(Long postId, Long parentId, UUID userId, String text) {
        return Comment.builder()
                .postId(postId)
                .parentId(parentId)
                .userId(userId)
                .text(text)
                .build();
    }
}
