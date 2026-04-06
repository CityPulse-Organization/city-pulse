package city.pulse.post.model.post;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.Formula;

import java.time.OffsetDateTime;
import java.util.UUID;

@Getter
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "posts")
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "image_url", nullable = false, columnDefinition = "TEXT")
    private String imageUrl;

    @Column(name = "caption", columnDefinition = "TEXT", length = 256)
    private String caption;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @Formula("(SELECT count(*) FROM post_likes l WHERE l.post_id = id)")
    @Builder.Default
    private int likeCount = 0;

    @Formula("(SELECT count(*) FROM comments c WHERE c.post_id = id)")
    @Builder.Default
    private int commentCount = 0;

    public void updateCaption(String caption) {
        this.caption = caption;
    }

    public static Post create(UUID userId, String imageUrl, String caption) {
        return Post.builder()
                .userId(userId)
                .imageUrl(imageUrl)
                .caption(caption)
                .build();
    }
}
