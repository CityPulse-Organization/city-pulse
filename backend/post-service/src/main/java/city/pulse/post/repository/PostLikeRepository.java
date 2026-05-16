package city.pulse.post.repository;

import city.pulse.post.model.post.PostLike;
import city.pulse.post.model.post.PostLikeId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Set;
import java.util.UUID;

public interface PostLikeRepository extends JpaRepository<PostLike, PostLikeId> {
    @Query("SELECT pl.postId FROM PostLike pl WHERE pl.userId = :userId AND pl.postId IN :postIds")
    Set<Long> findLikedPostIdsByUserIdAndPostIds(@Param("userId") UUID userId, @Param("postIds") List<Long> postIds);

    @Modifying
    @Query("DELETE FROM PostLike pl WHERE pl.userId = :userId")
    void deleteAllByUserId(@Param("userId") UUID userId);
}
