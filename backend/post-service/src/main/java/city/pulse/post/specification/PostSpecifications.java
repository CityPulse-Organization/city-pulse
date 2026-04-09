package city.pulse.post.specification;

import city.pulse.post.dto.PostFilterRequest;
import city.pulse.post.model.post.Post;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Locale;
import java.util.UUID;

@Component
public class PostSpecifications {
    public Specification<Post> getSpecification(PostFilterRequest filter, UUID currentUserId) {
        return (root, criteriaQuery, criteriaBuilder) -> {
            var predicates = new ArrayList<Predicate>();

            if (currentUserId != null && (filter == null || filter.authorId() == null)) {
                predicates.add(criteriaBuilder.notEqual(root.get("userId"), currentUserId));
            }

            if (filter == null) {
                return predicates.isEmpty() ? criteriaBuilder.conjunction() : criteriaBuilder.and(predicates.toArray(new Predicate[0]));
            }

            if (filter.caption() != null && !filter.caption().isBlank()) {
                var escapedCaption = escapeLikePattern(filter.caption().toLowerCase(Locale.ROOT));
                predicates.add(criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("caption")),
                        "%" + escapedCaption + "%",
                        '\\'
                ));
            }

            if (filter.authorId() != null) {
                predicates.add(criteriaBuilder.equal(root.get("userId"), filter.authorId()));
            }

            if (filter.createdAfter() != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(
                        root.get("createdAt"),
                        filter.createdAfter()
                ));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }

    private String escapeLikePattern(String input) {
        if (input == null) return null;
        return input.replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_");
    }
}
