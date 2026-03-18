package city.pulse.auth.model;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "linked_accounts")
public class LinkedAccount {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JoinColumn(name = "user_id")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private Credential credential;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    private AuthProvider provider;

    @Column(name = "provider_id", nullable = false)
    private String providerId;

    public static LinkedAccount build(Credential credential, AuthProvider provider, String providerId) {
        return LinkedAccount.builder()
                .credential(credential)
                .provider(provider)
                .providerId(providerId)
                .build();
    }
}