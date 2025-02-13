package ma.Nabil.SyndicNow.dto.syndic;

import lombok.Data;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import java.util.List;

@Data
public class SyndicCreateDTO {
    @NotBlank(message = "Le nom est obligatoire")
    private String nom;
    
    @NotBlank(message = "L'email est obligatoire")
    @Email(message = "Format d'email invalide")
    private String email;
    
    @Pattern(regexp = "^[+]?[0-9]{8,}$", message = "Format de téléphone invalide")
    private String telephone;
    
    @NotBlank(message = "L'adresse est obligatoire")
    private String adresse;
    
    @NotBlank(message = "La raison sociale est obligatoire")
    private String raisonSociale;
    
    private String registreCommerce;
    private String identifiantFiscal;
    private List<String> coordonneesBancaires;
    private List<String> contactsUrgence;
}
