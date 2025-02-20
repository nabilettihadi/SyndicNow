package ma.Nabil.SyndicNow.service;

import ma.Nabil.SyndicNow.domain.dto.auth.AuthenticationRequest;
import ma.Nabil.SyndicNow.domain.dto.auth.AuthenticationResponse;
import ma.Nabil.SyndicNow.domain.dto.auth.RegisterRequest;
import ma.Nabil.SyndicNow.domain.entity.Syndic;
import ma.Nabil.SyndicNow.domain.enums.Role;
import ma.Nabil.SyndicNow.repository.SyndicRepository;
import ma.Nabil.SyndicNow.security.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class AuthenticationServiceTest {

    @Autowired
    private AuthenticationService authenticationService;

    @Autowired
    private SyndicRepository syndicRepository;

    @Autowired
    private JwtService jwtService;

    private RegisterRequest validRegisterRequest;
    private AuthenticationRequest validAuthRequest;

    @BeforeEach
    void setUp() {
        validRegisterRequest = RegisterRequest.builder()
                .nom("Test")
                .prenom("User")
                .email("test@example.com")
                .password("password123")
                .telephone("0123456789")
                .adresse("123 Test St")
                .role(Role.ROLE_SYNDIC)
                .build();

        validAuthRequest = AuthenticationRequest.builder()
                .email("test@example.com")
                .password("password123")
                .build();
    }

    @Test
    void register_WithValidData_ShouldCreateUserAndReturnToken() {
        // When
        AuthenticationResponse response = authenticationService.register(validRegisterRequest);

        // Then
        assertNotNull(response);
        assertNotNull(response.getToken());
        
        Syndic savedUser = syndicRepository.findByEmail(validRegisterRequest.getEmail()).orElse(null);
        assertNotNull(savedUser);
        assertEquals(validRegisterRequest.getEmail(), savedUser.getEmail());
        assertEquals(validRegisterRequest.getNom(), savedUser.getNom());
        assertEquals(validRegisterRequest.getPrenom(), savedUser.getPrenom());
        assertEquals(validRegisterRequest.getTelephone(), savedUser.getTelephone());
        assertEquals(validRegisterRequest.getAdresse(), savedUser.getAdresse());
        assertEquals(Role.ROLE_SYNDIC, savedUser.getRole());
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
        AuthenticationResponse response = authenticationService.authenticate(validAuthRequest);

        // Then
        assertNotNull(response);
        assertNotNull(response.getToken());
        assertTrue(jwtService.isTokenValid(response.getToken(), 
            syndicRepository.findByEmail(validAuthRequest.getEmail()).orElseThrow()));
    }

    @Test
    void authenticate_WithInvalidCredentials_ShouldThrowException() {
        // Given
        authenticationService.register(validRegisterRequest);
        AuthenticationRequest invalidRequest = AuthenticationRequest.builder()
                .email(validAuthRequest.getEmail())
                .password("wrongpassword")
                .build();

        // When & Then
        assertThrows(BadCredentialsException.class, () -> {
            authenticationService.authenticate(invalidRequest);
        });
    }

    @Test
    void authenticate_WithNonExistentUser_ShouldThrowException() {
        // Given
        AuthenticationRequest nonExistentUser = AuthenticationRequest.builder()
                .email("nonexistent@example.com")
                .password("password123")
                .build();

        // When & Then
        assertThrows(BadCredentialsException.class, () -> {
            authenticationService.authenticate(nonExistentUser);
        });
    }
}
