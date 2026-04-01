package city.pulse.user.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "user_profiles")
public class UserProfile {
    @Id
    private UUID id;

    @Column(nullable = false, unique = true, length = 32)
    private String username;

    @Column(length = 512)
    private String bio;

    @Column(name = "job_title", length = 128)
    private String jobTitle;

    @Column(name = "avatar_url", length = 512)
    private String avatarUrl;

    public static UserProfile build(UUID userId, String username) {
        return UserProfile.builder()
                .id(userId)
                .username(username)
                .build();
    }

    public void updateProfile(String bio, String jobTitle, String avatarUrl) {
        if (bio != null) {
            this.bio = bio;
        }
        if (jobTitle != null) {
            this.jobTitle = jobTitle;
        }
        if (avatarUrl != null) {
            this.avatarUrl = avatarUrl;
        }
    }

    public void changeUsername(String newUsername) {
        if (newUsername != null && !newUsername.isBlank()) {
            this.username = newUsername;
        }
    }
}
