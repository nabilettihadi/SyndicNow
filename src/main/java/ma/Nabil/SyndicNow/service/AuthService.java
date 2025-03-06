package ma.Nabil.SyndicNow.service;

import ma.Nabil.SyndicNow.dto.auth.LoginRequest;
import ma.Nabil.SyndicNow.dto.auth.LoginResponse;
import ma.Nabil.SyndicNow.dto.auth.RegisterRequest;
import ma.Nabil.SyndicNow.dto.auth.RegisterResponse;

public interface AuthService {
    RegisterResponse register(RegisterRequest request);

    LoginResponse login(LoginRequest request);
} 