package city.pulse.post.repository;

import city.pulse.post.model.PostLike;
import city.pulse.post.model.PostLikeId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostLikeRepository extends JpaRepository<PostLike, PostLikeId> {
    void deleteByPostId(Long postId);
}
