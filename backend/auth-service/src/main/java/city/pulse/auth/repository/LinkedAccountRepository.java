package city.pulse.auth.repository;

import city.pulse.auth.model.AuthProvider;
import city.pulse.auth.model.LinkedAccount;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LinkedAccountRepository extends JpaRepository<LinkedAccount, Long> {
    Optional<LinkedAccount> findByProviderAndProviderId(AuthProvider provider, String providerId);
}
