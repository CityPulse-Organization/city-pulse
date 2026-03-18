package city.pulse.auth.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import city.pulse.auth.model.Credential;

import java.util.Optional;
import java.util.UUID;

public interface CredentialRepository extends JpaRepository<Credential, UUID> {
    Optional<Credential> findByEmail(String email);
}
