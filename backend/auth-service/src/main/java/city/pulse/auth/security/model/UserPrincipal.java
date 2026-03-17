package city.pulse.auth.security.model;

import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;
import java.util.UUID;

public record UserPrincipal(UUID id, String email, Collection<GrantedAuthority> authorities) {}
