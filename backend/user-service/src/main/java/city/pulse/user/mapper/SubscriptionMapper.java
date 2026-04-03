package city.pulse.user.mapper;

import city.pulse.user.dto.UserProfileResponse;
import city.pulse.user.model.Subscription;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface SubscriptionMapper {
    @Mapping(source = "subscriber.id", target = "id")
    @Mapping(source = "subscriber.username", target = "username")
    UserProfileResponse toFollowerResponse(Subscription subscription);

    @Mapping(source = "target.id", target = "id")
    @Mapping(source = "target.username", target = "username")
    UserProfileResponse toFollowingResponse(Subscription subscription);
}
