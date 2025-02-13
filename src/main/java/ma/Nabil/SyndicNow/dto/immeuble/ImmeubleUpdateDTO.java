package ma.Nabil.SyndicNow.dto.immeuble;

import lombok.Data;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import java.util.Date;
import java.util.List;

@Data
public class ImmeubleUpdateDTO {
    private Long id;
    private String nom;
    private String adresse;
    private String ville;
    private String codePostal;
    
    @Positive(message = "Le nombre d'étages doit être positif")
    private Integer nombreEtages;
    
    @PositiveOrZero(message = "La surface totale doit être positive ou nulle")
    private Double surfaceTotale;
    
    // Informations d'assurance
    private String numeroPoliceAssurance;
    private String compagnieAssurance;
    private Date dateExpirationAssurance;
    
    private Long syndicId;
    private List<String> equipements;
    private List<String> contactsUrgence;
}
