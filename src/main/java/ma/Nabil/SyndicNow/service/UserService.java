package ma.Nabil.SyndicNow.service;

import ma.Nabil.SyndicNow.dto.user.UserResponse;

import java.util.List;

public interface UserService {

    UserResponse getUserById(Long id);

    List<UserResponse> getAllUsers();
} 