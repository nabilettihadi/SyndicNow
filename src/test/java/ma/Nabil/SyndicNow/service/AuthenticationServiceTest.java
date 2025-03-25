package ma.Nabil.SyndicNow.service;

import ma.Nabil.SyndicNow.dto.auth.LoginRequest;
import ma.Nabil.SyndicNow.dto.auth.LoginResponse;
import ma.Nabil.SyndicNow.dto.auth.RegisterRequest;
import ma.Nabil.SyndicNow.dto.auth.RegisterResponse;
import ma.Nabil.SyndicNow.enums.PreferenceCommunication;
import ma.Nabil.SyndicNow.enums.Role;
import ma.Nabil.SyndicNow.enums.TypeProprietaire;
import ma.Nabil.SyndicNow.exception.InvalidOperationException;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.test.context.ActiveProfiles;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

@SpringBootTest
@ActiveProfiles("test")
public class AuthenticationServiceTest {

    @Autowired
    private AuthService authService;

    // Helper pour créer des requêtes d'inscription avec des emails uniques
    private RegisterRequest createUniqueRegisterRequest() {
        String uniqueEmail = "test-" + UUID.randomUUID().toString().substring(0, 8) + "@example.com";
        return RegisterRequest.builder()
                .email(uniqueEmail)
                .password("password")
                .nom("Test")
                .prenom("User")
                .telephone("1234567890")
                .adresse("Test Address")
                .cin(UUID.randomUUID().toString().substring(0, 8))
                .role(Role.PROPRIETAIRE)
                .preferencesCommunication(PreferenceCommunication.EMAIL)
                .typeProprietaire(TypeProprietaire.PERSONNE_PHYSIQUE)
                .build();
    }

    @Test
    void register_WithValidData_ShouldCreateUserAndReturnToken() {
        // Given
        RegisterRequest request = createUniqueRegisterRequest();
        
        // When
        RegisterResponse response = authService.register(request);

        // Then
        assertNotNull(response);
        assertNotNull(response.getToken());
    }

    @Test
    void register_WithExistingEmail_ShouldThrowException() {
        // Given
        RegisterRequest request = createUniqueRegisterRequest();
        authService.register(request);

        // When & Then
        assertThrows(InvalidOperationException.class, () -> {
            authService.register(request);
        });
    }

    @Test
    void login_WithValidCredentials_ShouldReturnToken() {
        // Given
        RegisterRequest registerRequest = createUniqueRegisterRequest();
        authService.register(registerRequest);
        
        LoginRequest loginRequest = LoginRequest.builder()
                .email(registerRequest.getEmail())
                .password(registerRequest.getPassword())
                .build();

        // When
        LoginResponse response = authService.login(loginRequest);

        // Then
        assertNotNull(response);
        assertNotNull(response.getToken());
    }

    @Test
    void login_WithInvalidCredentials_ShouldThrowException() {
        // Given
        RegisterRequest registerRequest = createUniqueRegisterRequest();
        authService.register(registerRequest);
        
        LoginRequest invalidRequest = LoginRequest.builder()
                .email(registerRequest.getEmail())
                .password("wrongpassword")
                .build();

        // When & Then
        assertThrows(BadCredentialsException.class, () -> {
            authService.login(invalidRequest);
        });
    }
}
