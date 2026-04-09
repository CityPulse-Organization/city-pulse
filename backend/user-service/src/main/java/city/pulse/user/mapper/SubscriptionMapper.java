package city.pulse.user.mapper;

import city.pulse.user.dto.UserProfileResponse;
import city.pulse.user.model.Subscription;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface SubscriptionMapper {
    @Mapping(source = "subscriber", target = ".")
    UserProfileResponse toFollowerResponse(Subscription subscription);

    @Mapping(source = "target", target = ".")
    UserProfileResponse toFollowingResponse(Subscription subscription);
}
