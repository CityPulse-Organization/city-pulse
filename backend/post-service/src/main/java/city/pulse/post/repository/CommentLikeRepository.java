package city.pulse.post.repository;

import city.pulse.post.model.comment.CommentLike;
import city.pulse.post.model.comment.CommentLikeId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Set;
import java.util.UUID;

public interface CommentLikeRepository extends JpaRepository<CommentLike, CommentLikeId> {
    @Query("SELECT cl.commentId FROM CommentLike cl WHERE cl.userId = :userId AND cl.commentId IN :commentIds")
    Set<Long> findLikedCommentIdsByUserIdAndCommentIds(@Param("userId") UUID userId, @Param("commentIds") List<Long> commentIds);

    @Modifying
    @Query("DELETE FROM CommentLike cl WHERE cl.userId = :userId")
    void deleteAllByUserId(@Param("userId") UUID userId);
}
