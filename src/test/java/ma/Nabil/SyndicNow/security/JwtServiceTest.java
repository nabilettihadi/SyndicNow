package ma.Nabil.SyndicNow.security;

import ma.Nabil.SyndicNow.entity.Syndic;
import ma.Nabil.SyndicNow.enums.Role;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
class JwtServiceTest {

    @Autowired
    private JwtService jwtService;

    private Syndic testUser;

    @BeforeEach
    void setUp() {
        testUser = Syndic.builder()
                .email("test@example.com")
                .nom("Test")
                .prenom("User")
                .password("password123")
                .telephone("0123456789")
                .role(Role.SYNDIC)
                .build();
    }

    @Test
    void generateToken_ShouldCreateValidToken() {
        // When
        String token = jwtService.generateToken(testUser);

        // Then
        assertNotNull(token);
        assertTrue(jwtService.isTokenValid(token, testUser));
    }

    @Test
    void extractUsername_ShouldReturnCorrectEmail() {
        // When
        String token = jwtService.generateToken(testUser);
        String extractedUsername = jwtService.extractUsername(token);

        // Then
        assertEquals(testUser.getEmail(), extractedUsername);
    }

    @Test
    void isTokenValid_WithExpiredToken_ShouldReturnFalse() {
        // Given
        String expiredToken = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0QGV4YW1wbGUuY29tIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyMzkwMjJ9.8Wu6GVPxzqxuHD6V8Xy0tH6PjH2Q5Xq5z1NWY6HXgHE";

        // When & Then
        assertFalse(jwtService.isTokenValid(expiredToken, testUser));
    }

    @Test
    void isTokenValid_WithInvalidSignature_ShouldReturnFalse() {
        // Given
        String tokenWithInvalidSignature = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0QGV4YW1wbGUuY29tIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjk5OTk5OTk5OTl9.invalid_signature";

        // When & Then
        assertFalse(jwtService.isTokenValid(tokenWithInvalidSignature, testUser));
    }

    @Test
    void isTokenValid_WithDifferentUser_ShouldReturnFalse() {
        // Given
        String token = jwtService.generateToken(testUser);
        Syndic differentUser = Syndic.builder()
                .email("different@example.com")
                .nom("Different")
                .prenom("User")
                .password("password123")
                .telephone("9876543210")
                .role(Role.SYNDIC)
                .build();

        // When & Then
        assertFalse(jwtService.isTokenValid(token, differentUser));
    }
}
