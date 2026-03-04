package city.pulse.auth.feature.service;

import city.pulse.auth.feature.model.User;

public interface UserService {
    User findUserById(Long id);
    User findUserByUsername(String username);
}
