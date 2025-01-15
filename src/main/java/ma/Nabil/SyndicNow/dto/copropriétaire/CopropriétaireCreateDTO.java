package ma.Nabil.SyndicNow.dto;

import lombok.Data;
import ma.Nabil.SyndicNow.model.enums.TypeProprietaire;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;

@Data
public class CopropriétaireCreateDTO {
    @NotBlank(message = "Le nom est obligatoire")
    private String nom;
    
    @NotBlank(message = "Le CIN est obligatoire")
    @Pattern(regexp = "[A-Z]{1,2}[0-9]{5,6}", message = "Format de CIN invalide")
    private String cin;
    
    @Email(message = "Format d'email invalide")
    private String email;
    
    @Pattern(regexp = "^[+]?[0-9]{8,}$", message = "Format de téléphone invalide")
    private String telephone;
    
    @NotBlank(message = "L'adresse est obligatoire")
    private String adresse;
    
    @NotNull(message = "Le type de propriétaire est obligatoire")
    private TypeProprietaire type;
    
    // Informations professionnelles optionnelles
    private String profession;
    private String employeur;
    private String telephoneProfessionnel;
    
    // Informations bancaires
    private String rib;
    private String banque;
    
    // Préférences de communication
    private boolean notificationsEmail;
    private boolean notificationsSMS;
}
