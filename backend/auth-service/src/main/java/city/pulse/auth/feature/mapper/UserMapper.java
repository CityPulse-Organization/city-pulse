package city.pulse.auth.feature.mapper;

import city.pulse.auth.feature.dto.RegistrationRequest;
import city.pulse.auth.feature.dto.RegistrationResponse;
import city.pulse.auth.feature.model.User;
import city.pulse.auth.feature.oauth2.dto.OAuth2UserInfo;
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

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "role", constant = "USER")
    @Mapping(target = "password", source = "generatedPassword")
    @Mapping(target = "username", source = "username")
    User toEntity(OAuth2UserInfo userInfo, String username, String generatedPassword);
}