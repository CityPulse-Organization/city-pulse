package city.pulse.auth.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.Duration;
import java.time.Instant;

@Getter
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "refresh_tokens")
public class RefreshToken {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JoinColumn(name = "user_id")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private Credential credential;

    @Column(nullable = false, unique = true, length = 44)
    private String tokenHash;

    @Column(nullable = false)
    private Instant issuedAt;

    @Column(nullable = false)
    private Instant expiresAt;

    @Builder.Default
    @Column(nullable = false)
    private boolean revoked = false;

    public void revoke() {
        this.revoked = true;
    }

    public static RefreshToken build(Credential credential, String hash, Duration ttl) {
        var now = Instant.now();
        return RefreshToken.builder()
                .credential(credential)
                .tokenHash(hash)
                .issuedAt(now)
                .expiresAt(now.plus(ttl))
                .build();
    }
}
