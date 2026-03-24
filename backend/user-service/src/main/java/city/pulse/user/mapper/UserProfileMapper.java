package city.pulse.user.mapper;

import city.pulse.user.dto.UserProfileResponse;
import city.pulse.user.model.UserProfile;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserProfileMapper {
    UserProfileResponse toResponse(UserProfile userProfile);
}
