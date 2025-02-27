package ma.Nabil.SyndicNow.service;

import ma.Nabil.SyndicNow.dto.auth.AuthenticationRequest;
import ma.Nabil.SyndicNow.dto.auth.RegisterRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

@SpringBootTest
@ActiveProfiles("test")
public class AuthenticationServiceTest {

    @Autowired
    private AuthenticationService authenticationService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private RegisterRequest validRegisterRequest;
    private AuthenticationRequest validAuthRequest;

    @BeforeEach
    void setUp() {
        validRegisterRequest = RegisterRequest.builder()
                .email("test@example.com")
                .password("password")
                .nom("Test")
                .prenom("User")
                .build();

        validAuthRequest = AuthenticationRequest.builder()
                .email("test@example.com")
                .password("password")
                .build();
    }

    @Test
    void register_WithValidData_ShouldCreateUserAndReturnToken() {
        // When
        var response = authenticationService.register(validRegisterRequest);

        // Then
        assertNotNull(response);
        assertNotNull(response.getToken());
    }

    @Test
    void register_WithExistingEmail_ShouldThrowException() {
        // Given
        authenticationService.register(validRegisterRequest);

        // When & Then
        assertThrows(RuntimeException.class, () -> {
            authenticationService.register(validRegisterRequest);
        });
    }

    @Test
    void authenticate_WithValidCredentials_ShouldReturnToken() {
        // Given
        authenticationService.register(validRegisterRequest);

        // When
        var response = authenticationService.authenticate(validAuthRequest);

        // Then
        assertNotNull(response);
        assertNotNull(response.getToken());
    }

    @Test
    void authenticate_WithInvalidCredentials_ShouldThrowException() {
        // Given
        authenticationService.register(validRegisterRequest);
        var invalidRequest = AuthenticationRequest.builder()
                .email(validAuthRequest.getEmail())
                .password("wrongpassword")
                .build();

        // When & Then
        assertThrows(BadCredentialsException.class, () -> {
            authenticationService.authenticate(invalidRequest);
        });
    }
}
