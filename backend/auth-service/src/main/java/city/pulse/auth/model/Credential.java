package city.pulse.auth.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Getter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "credentials")
public class Credential {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(name = "password_hash")
    private String passwordHash;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    private Role role = Role.USER;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    private UserStatus status = UserStatus.ACTIVE;

    public static Credential build(String email, String passwordHash) {
        return Credential.builder()
                .email(email)
                .passwordHash(passwordHash)
                .build();
    }
}
