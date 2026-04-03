package city.pulse.user.specification;

import city.pulse.user.model.UserProfile;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Locale;

@Component
public class UserProfileSpecifications {
    public Specification<UserProfile> getSpecification(String searchUsername, String currentUsername) {
        return (root, criteriaQuery, criteriaBuilder) -> {
            var predicates = new ArrayList<Predicate>();

            if (currentUsername != null) {
                predicates.add(criteriaBuilder.notEqual(root.get("username"), currentUsername));
            }

            if (searchUsername != null && !searchUsername.isBlank()) {
                var escapedUsername = escapeLikePattern(searchUsername.toLowerCase(Locale.ROOT));
                predicates.add(criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("username")),
                        "%" + escapedUsername + "%",
                        '\\'));
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
