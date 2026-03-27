package city.pulse.common.security.model;

import java.util.List;
import java.util.UUID;

public record UserInfo(
    UUID id,
    List<String> roles
) {}
