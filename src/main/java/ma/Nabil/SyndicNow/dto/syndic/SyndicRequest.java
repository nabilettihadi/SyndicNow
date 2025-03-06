package ma.Nabil.SyndicNow.dto.syndic;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SyndicRequest {

    @NotBlank(message = "Le nom est obligatoire")
    @Size(min = 2, max = 50, message = "Le nom doit contenir entre 2 et 50 caractères")
    private String nom;

    @NotBlank(message = "Le prénom est obligatoire")
    @Size(min = 2, max = 50, message = "Le prénom doit contenir entre 2 et 50 caractères")
    private String prenom;

    @NotBlank(message = "L'email est obligatoire")
    @Email(message = "Format d'email invalide")
    private String email;

    @NotBlank(message = "Le mot de passe est obligatoire")
    @Size(min = 6, message = "Le mot de passe doit contenir au moins 6 caractères")
    private String password;

    @NotBlank(message = "Le téléphone est obligatoire")
    @Pattern(regexp = "^[0-9]{10}$", message = "Le numéro de téléphone doit contenir 10 chiffres")
    private String telephone;

    private String adresse;

    @NotBlank(message = "Le CIN est obligatoire")
    @Size(min = 4, max = 10, message = "Le CIN doit contenir entre 4 et 10 caractères")
    private String cin;

    @NotBlank(message = "Le numéro de licence est obligatoire")
    private String numeroLicence;

    @NotBlank(message = "Le SIRET est obligatoire")
    @Pattern(regexp = "^[0-9]{14}$", message = "Le SIRET doit contenir 14 chiffres")
    private String siret;

    @NotBlank(message = "Le nom de la société est obligatoire")
    private String societe;

    private LocalDateTime dateDebutActivite;
} 