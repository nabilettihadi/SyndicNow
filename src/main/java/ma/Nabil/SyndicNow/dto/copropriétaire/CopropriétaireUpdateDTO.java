package ma.Nabil.SyndicNow.dto.copropriétaire;

import lombok.Data;
import ma.Nabil.SyndicNow.model.enums.TypeProprietaire;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;

@Data
public class CopropriétaireUpdateDTO {
    private Long id;
    private String nom;
    
    @Pattern(regexp = "[A-Z]{1,2}[0-9]{5,6}", message = "Format de CIN invalide")
    private String cin;
    
    @Email(message = "Format d'email invalide")
    private String email;
    
    @Pattern(regexp = "^[+]?[0-9]{8,}$", message = "Format de téléphone invalide")
    private String telephone;
    
    private String adresse;
    private TypeProprietaire type;
    
    // Informations professionnelles
    private String profession;
    private String employeur;
    private String telephoneProfessionnel;
    
    // Informations bancaires
    private String rib;
    private String banque;
    
    // Préférences de communication
    private Boolean notificationsEmail;
    private Boolean notificationsSMS;
    
    // État du compte
    private Boolean actif;
}
