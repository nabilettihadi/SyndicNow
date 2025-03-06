package ma.Nabil.SyndicNow.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {
    private Long userId;
    private String email;
    private String nom;
    private String prenom;
    private String role;
    private String token;
    private boolean isActive;
} 