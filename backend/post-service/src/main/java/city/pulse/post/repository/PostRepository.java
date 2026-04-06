package city.pulse.post.repository;

import city.pulse.post.model.post.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.UUID;

public interface PostRepository extends JpaRepository<Post, Long>, JpaSpecificationExecutor<Post> {
    @Query("SELECT p FROM Post p, SavedPost sp WHERE p.id = sp.postId AND sp.userId = :userId ORDER BY sp.savedAt DESC")
    Page<Post> findSavedPostsByUserId(@Param("userId") UUID userId, Pageable pageable);
}
