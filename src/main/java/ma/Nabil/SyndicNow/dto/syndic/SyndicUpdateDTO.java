package ma.Nabil.SyndicNow.dto;

import ma.Nabil.SyndicNow.model.enums.StatutSyndic;
import lombok.Data;

import javax.validation.constraints.Email;
import javax.validation.constraints.Pattern;
import java.util.List;

@Data
public class SyndicUpdateDTO {
    private Long id;
    
    private String nom;
    
    @Email(message = "Format d'email invalide")
    private String email;
    
    @Pattern(regexp = "^[+]?[0-9]{8,}$", message = "Format de téléphone invalide")
    private String telephone;
    
    private String adresse;
    private String raisonSociale;
    private String registreCommerce;
    private String identifiantFiscal;
    private StatutSyndic statut;
    private List<String> coordonneesBancaires;
    private List<String> contactsUrgence;
}
