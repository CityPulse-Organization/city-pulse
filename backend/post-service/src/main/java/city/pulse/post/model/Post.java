package city.pulse.post.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.Formula;

import java.time.OffsetDateTime;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
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
    private Long userId;

    @Column(name = "image_url", nullable = false, columnDefinition = "TEXT")
    private String imageUrl;

    @Column(name = "caption", columnDefinition = "TEXT")
    private String caption;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @Builder.Default
    @ElementCollection
    @CollectionTable(name = "post_likes", joinColumns = @JoinColumn(name = "post_id"))
    @Column(name = "user_id")
    private Set<Long> likedByUsers = new HashSet<>();

    public int getLikeCount() {
        return likedByUsers.size();
    }

    @Formula("(SELECT count(*) FROM comments c WHERE c.post_id = id)")
    @Builder.Default
    private int commentCount = 0;

    public static Post createPost(Long userId, String imageUrl, String caption) {
        return Post.builder()
                .userId(userId)
                .imageUrl(imageUrl)
                .caption(caption)
                .build();
    }
}