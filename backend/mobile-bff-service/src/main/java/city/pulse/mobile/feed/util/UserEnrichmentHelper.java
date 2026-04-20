package city.pulse.mobile.feed.util;

import city.pulse.mobile.feed.client.UserClient;
import city.pulse.mobile.feed.dto.common.RestPage;
import city.pulse.mobile.feed.dto.user.UserProfileResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.web.PagedModel;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.UUID;
import java.util.function.BiFunction;
import java.util.function.Function;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class UserEnrichmentHelper {
    private final UserClient client;

    public <T, R> PagedModel<R> enrichWithUsers(
            RestPage<T> pageData,
            int page,
            int size,
            Function<T, UUID> userIdExtractor,
            BiFunction<T, UserProfileResponse, R> responseMapper
    ) {
        if (pageData.content().isEmpty()) {
            return new PagedModel<>(new PageImpl<>(
                    List.of(),
                    PageRequest.of(page, size),
                    0
            ));
        }

        var userIds = pageData.content().stream()
                .map(userIdExtractor)
                .collect(Collectors.toSet());

        var userProfilesMap = client.getUsersBatch(userIds)
                .stream()
                .collect(Collectors.toMap(
                        UserProfileResponse::id,
                        profile -> profile
                ));

        var enrichedContent = pageData.content().stream()
                .map(item -> {
                    var userId = userIdExtractor.apply(item);
                    var userProfile = userProfilesMap.get(userId);
                    return responseMapper.apply(item, userProfile);
                })
                .toList();

        return new PagedModel<>(new PageImpl<>(
                enrichedContent,
                PageRequest.of(page, size),
                pageData.page().totalElements()
        ));
    }
}
