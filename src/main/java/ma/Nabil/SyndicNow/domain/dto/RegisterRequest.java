package ma.Nabil.SyndicNow.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import ma.Nabil.SyndicNow.domain.enums.Role;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {
    private String nom;
    private String prenom;
    private String email;
    private String password;
    private String telephone;
    private String adresse;
    private Role role;
}
