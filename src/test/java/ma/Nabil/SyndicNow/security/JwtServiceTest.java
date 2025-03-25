package ma.Nabil.SyndicNow.security;

import ma.Nabil.SyndicNow.entity.Syndic;
import ma.Nabil.SyndicNow.enums.Role;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
@ActiveProfiles("test")
class JwtServiceTest {

    @Autowired
    private JwtService jwtService;

    @Test
    void generateTokenAndValidateToken() {
        Syndic syndic = Syndic.builder().email("test@example.com").password("password").role(Role.SYNDIC).build();
        CustomUserDetails userDetails = CustomUserDetails.fromUser(syndic);

        String token = jwtService.generateToken(userDetails);
        assertTrue(jwtService.isTokenValid(token, userDetails));
    }

    @Test
    void tokenShouldBeInvalidForDifferentUser() {
        Syndic syndic = Syndic.builder().email("test@example.com").password("password").role(Role.SYNDIC).build();
        CustomUserDetails userDetails = CustomUserDetails.fromUser(syndic);

        String token = jwtService.generateToken(userDetails);

        Syndic differentSyndic = Syndic.builder().email("different@example.com").password("password").role(Role.SYNDIC).build();
        CustomUserDetails differentUser = CustomUserDetails.fromUser(differentSyndic);

        assertFalse(jwtService.isTokenValid(token, differentUser));
    }
}
