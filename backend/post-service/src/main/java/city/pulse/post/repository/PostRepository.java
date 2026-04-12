package city.pulse.post.repository;

import city.pulse.post.model.post.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface PostRepository extends JpaRepository<Post, Long>, JpaSpecificationExecutor<Post> {
    @Query("SELECT p FROM Post p, SavedPost sp WHERE p.id = sp.postId AND sp.userId = :userId ORDER BY sp.savedAt DESC")
    Page<Post> findSavedPostsByUserId(@Param("userId") UUID userId, Pageable pageable);

    @Query(value = """
        SELECT p.id, p.user_id, p.image_url, p.caption, p.location, p.created_at,
               (SELECT count(*) FROM post_likes l WHERE l.post_id = p.id) as likeCount,
               (SELECT count(*) FROM comments c WHERE c.post_id = p.id) as commentCount
        FROM posts p
        WHERE ST_DWithin(
            p.location::geography, 
            ST_SetSRID(ST_MakePoint(:lon, :lat), 4326)::geography, 
            :radiusInMeters
        )
        ORDER BY ST_Distance(p.location::geography, ST_SetSRID(ST_MakePoint(:lon, :lat), 4326)::geography)
    """, nativeQuery = true)
    List<Post> findNearby(
            @Param("lat") double lat,
            @Param("lon") double lon,
            @Param("radiusInMeters") double radiusInMeters
    );

    @Query(value = """
        SELECT p.id, p.user_id, p.image_url, p.caption, p.location, p.created_at,
               (SELECT count(*) FROM post_likes l WHERE l.post_id = p.id) as likeCount,
               (SELECT count(*) FROM comments c WHERE c.post_id = p.id) as commentCount
        FROM posts p
        WHERE p.location && ST_MakeEnvelope(:minLon, :minLat, :maxLon, :maxLat, 4326)
    """, nativeQuery = true)
    List<Post> findWithinBoundingBox(
            @Param("minLon") double minLon,
            @Param("minLat") double minLat,
            @Param("maxLon") double maxLon,
            @Param("maxLat") double maxLat
    );
}
