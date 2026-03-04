package city.pulse.auth.feature.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import city.pulse.auth.feature.model.RefreshToken;

import java.time.Instant;
import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    @Query("""
           select r from RefreshToken r
           where r.tokenHash = :hash
             and r.revoked = false
             and r.expiresAt > :now
           """)
    Optional<RefreshToken> findActiveByHash(@Param("hash") String hash, @Param("now") Instant now);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("update RefreshToken r set r.revoked = true where r.id = :id")
    void revokeById(@Param("id") Long id);
}
