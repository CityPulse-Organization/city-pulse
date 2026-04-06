package city.pulse.post.repository;

import city.pulse.post.model.comment.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    @Query("SELECT c FROM Comment c WHERE c.postId = :postId AND c.parentId IS NULL ORDER BY c.createdAt ASC")
    Page<Comment> findRootComments(Long postId, Pageable pageable);

    @Query("SELECT c FROM Comment c WHERE c.parentId = :parentId ORDER BY c.createdAt ASC")
    Page<Comment> findReplies(Long parentId, Pageable pageable);
}
