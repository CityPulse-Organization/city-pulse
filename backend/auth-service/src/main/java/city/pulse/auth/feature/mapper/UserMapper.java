package city.pulse.auth.feature.mapper;

import city.pulse.auth.feature.dto.RegistrationRequest;
import city.pulse.auth.feature.dto.RegistrationResponse;
import city.pulse.auth.feature.model.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {
    RegistrationResponse toDTO(User user);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "role", constant = "USER")
    @Mapping(target = "password", source = "encodedPassword")
    @Mapping(target = "username", source = "dto.username")
    @Mapping(target = "email", source = "dto.email")
    User toEntity(RegistrationRequest dto, String encodedPassword);
}