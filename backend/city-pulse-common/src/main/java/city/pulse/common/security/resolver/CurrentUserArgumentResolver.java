package city.pulse.common.security.resolver;

import city.pulse.common.security.annotation.CurrentUser;
import city.pulse.common.security.model.UserInfo;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.core.MethodParameter;
import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;

public class CurrentUserArgumentResolver implements HandlerMethodArgumentResolver {
    public static final String USER_ID_HEADER = "X-User-Id";
    public static final String USER_ROLES_HEADER = "X-User-Roles";

    @Override
    public boolean supportsParameter(@NonNull MethodParameter parameter) {
        return parameter.hasParameterAnnotation(CurrentUser.class) &&
               parameter.getParameterType().equals(UserInfo.class);
    }

    @Override
    public Object resolveArgument(@NonNull MethodParameter parameter,
                                  @Nullable ModelAndViewContainer mavContainer,
                                  @NonNull NativeWebRequest webRequest,
                                  @Nullable WebDataBinderFactory binderFactory) throws Exception {

        var request = (HttpServletRequest) webRequest.getNativeRequest();
        
        var userIdStr = request.getHeader(USER_ID_HEADER);
        var userRolesStr = request.getHeader(USER_ROLES_HEADER);

        if (userIdStr == null || userIdStr.isBlank()) {
            throw new IllegalArgumentException("Missing required " + USER_ID_HEADER + " header");
        }

        var userId = UUID.fromString(userIdStr);
        List<String> roles = userRolesStr == null || userRolesStr.isBlank()
                ? List.of()
                : Arrays.asList(userRolesStr.split(","));

        return new UserInfo(userId, roles);
    }
}
