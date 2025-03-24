package ma.Nabil.SyndicNow.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import ma.Nabil.SyndicNow.enums.PreferenceCommunication;
import ma.Nabil.SyndicNow.enums.Role;
import ma.Nabil.SyndicNow.enums.TypeProprietaire;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {

    @NotBlank(message = "Le nom est obligatoire")
    private String nom;

    @NotBlank(message = "Le prénom est obligatoire")
    private String prenom;

    @NotBlank(message = "L'email est obligatoire")
    @Email(message = "Format d'email invalide")
    private String email;

    @NotBlank(message = "Le mot de passe est obligatoire")
    @Size(min = 6, message = "Le mot de passe doit contenir au moins 6 caractères")
    private String password;

    @NotBlank(message = "Le numéro de téléphone est obligatoire")
    @Pattern(regexp = "^[+]?[0-9]{8,}$", message = "Format de téléphone invalide")
    private String telephone;

    @NotBlank(message = "L'adresse est obligatoire")
    private String adresse;

    @NotBlank(message = "Le CIN est obligatoire")
    private String cin;

    private Role role;

    // Champs spécifiques au syndic
    @Pattern(regexp = "^[0-9]{14}$", message = "Le SIRET doit contenir exactement 14 chiffres")
    private String siret;

    private String numeroLicence;

    private String societe;

    private LocalDateTime dateDebutActivite;

    // Champs spécifiques au propriétaire
    private PreferenceCommunication preferencesCommunication;

    private TypeProprietaire typeProprietaire;
} 