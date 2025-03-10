package ma.Nabil.SyndicNow.service;

import ma.Nabil.SyndicNow.dto.auth.LoginRequest;
import ma.Nabil.SyndicNow.dto.auth.LoginResponse;
import ma.Nabil.SyndicNow.dto.auth.RegisterRequest;
import ma.Nabil.SyndicNow.dto.auth.RegisterResponse;

public interface AuthService {
    // Enregistrement pour Syndic et Proprietaire uniquement
    RegisterResponse register(RegisterRequest request);
    
    // Login pour tous les utilisateurs (Admin, Syndic, Proprietaire)
    LoginResponse login(LoginRequest request);
    
    void logout(String token);
} 