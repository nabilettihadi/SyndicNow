package ma.Nabil.SyndicNow.domain.dto.proprietaire;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProprietaireUpdateDTO {
    private String nom;
    private String prenom;

    @Email(message = "Format d'email invalide")
    private String email;

    @Pattern(regexp = "^[+]?[0-9]{8,15}$", message = "Format de téléphone invalide")
    private String telephone;

    private String adresse;
    private Boolean enabled;
}
