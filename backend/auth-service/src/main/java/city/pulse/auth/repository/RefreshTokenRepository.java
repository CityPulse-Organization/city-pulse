package city.pulse.auth.repository;

import city.pulse.auth.model.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

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
