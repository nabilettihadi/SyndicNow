package ma.Nabil.SyndicNow.dto.proprietaire;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import ma.Nabil.SyndicNow.enums.PreferenceCommunication;
import ma.Nabil.SyndicNow.enums.TypeProprietaire;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProprietaireRequest {
    @NotBlank(message = "Le nom est obligatoire")
    private String nom;

    @NotBlank(message = "Le prénom est obligatoire")
    private String prenom;

    @NotBlank(message = "L'email est obligatoire")
    @Email(message = "Format d'email invalide")
    private String email;

    @NotBlank(message = "Le numéro de téléphone est obligatoire")
    @Pattern(regexp = "^(\\+212|0)[5-7][0-9]{8}$", message = "Format de numéro de téléphone invalide")
    private String telephone;

    private String adresse;
    private String cin;
    private PreferenceCommunication preferencesCommunication;
    private TypeProprietaire typeProprietaire;
    private Long immeubleId;
    private Long appartementId;
} 