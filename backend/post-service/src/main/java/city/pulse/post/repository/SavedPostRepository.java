package city.pulse.post.repository;

import city.pulse.post.model.saved.SavedPost;
import city.pulse.post.model.saved.SavedPostId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Set;
import java.util.UUID;

public interface SavedPostRepository extends JpaRepository<SavedPost, SavedPostId> {
    @Query("SELECT sp.postId FROM SavedPost sp WHERE sp.userId = :userId AND sp.postId IN :postIds")
    Set<Long> findSavedPostIdsByUserIdAndPostIds(@Param("userId") UUID userId, @Param("postIds") List<Long> postIds);

    @Modifying
    @Query("DELETE FROM SavedPost sp WHERE sp.userId = :userId")
    void deleteAllByUserId(@Param("userId") UUID userId);
}
