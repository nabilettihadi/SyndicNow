package ma.Nabil.SyndicNow.service;

import ma.Nabil.SyndicNow.dto.auth.LoginRequest;
import ma.Nabil.SyndicNow.dto.auth.LoginResponse;
import ma.Nabil.SyndicNow.dto.auth.RegisterRequest;
import ma.Nabil.SyndicNow.dto.auth.RegisterResponse;
import ma.Nabil.SyndicNow.enums.Role;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

@SpringBootTest
@ActiveProfiles("test")
public class AuthenticationServiceTest {

    @Autowired
    private AuthService authService;

    private RegisterRequest validRegisterRequest;
    private LoginRequest validLoginRequest;

    @BeforeEach
    void setUp() {
        validRegisterRequest = RegisterRequest.builder()
                .email("test@example.com")
                .password("password")
                .nom("Test")
                .prenom("User")
                .telephone("1234567890")
                .adresse("Test Address")
                .cin("AB123456")
                .role(Role.PROPRIETAIRE)
                .build();

        validLoginRequest = LoginRequest.builder()
                .email("test@example.com")
                .password("password")
                .build();
    }

    @Test
    void register_WithValidData_ShouldCreateUserAndReturnToken() {
        // When
        RegisterResponse response = authService.register(validRegisterRequest);

        // Then
        assertNotNull(response);
        assertNotNull(response.getToken());
    }

    @Test
    void register_WithExistingEmail_ShouldThrowException() {
        // Given
        authService.register(validRegisterRequest);

        // When & Then
        assertThrows(RuntimeException.class, () -> {
            authService.register(validRegisterRequest);
        });
    }

    @Test
    void login_WithValidCredentials_ShouldReturnToken() {
        // Given
        authService.register(validRegisterRequest);

        // When
        LoginResponse response = authService.login(validLoginRequest);

        // Then
        assertNotNull(response);
        assertNotNull(response.getToken());
    }

    @Test
    void login_WithInvalidCredentials_ShouldThrowException() {
        // Given
        authService.register(validRegisterRequest);
        LoginRequest invalidRequest = LoginRequest.builder().email(validLoginRequest.getEmail()).password("wrongpassword").build();

        // When & Then
        assertThrows(BadCredentialsException.class, () -> {
            authService.login(invalidRequest);
        });
    }
}
