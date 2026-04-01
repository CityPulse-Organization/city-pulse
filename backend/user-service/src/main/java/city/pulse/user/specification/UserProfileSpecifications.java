package city.pulse.user.specification;

import city.pulse.user.model.UserProfile;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Locale;
import java.util.UUID;

@Component
public class UserProfileSpecifications {
    public Specification<UserProfile> getSpecification(String username, UUID excludeId) {
        return (root, criteriaQuery, criteriaBuilder) -> {
            var predicates = new ArrayList<Predicate>();

            if (username != null && !username.isBlank()) {
                var escapedUsername = escapeLikePattern(username.toLowerCase(Locale.ROOT));
                predicates.add(criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("username")),
                        "%" + escapedUsername + "%",
                        '\\'));
            }

            if (excludeId != null) {
                predicates.add(criteriaBuilder.notEqual(root.get("id"), excludeId));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }

    private String escapeLikePattern(String input) {
        if (input == null)
            return null;
        return input.replace("\\", "\\\\")
                .replace("%", "\\%")
                .replace("_", "\\_");
    }
}
