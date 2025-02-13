package ma.Nabil.SyndicNow.dto.immeuble;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import java.util.Date;
import java.util.List;

@Data
public class ImmeubleCreateDTO {
    @NotBlank(message = "Le nom est obligatoire")
    private String nom;
    
    @NotBlank(message = "L'adresse est obligatoire")
    private String adresse;
    
    @NotBlank(message = "La ville est obligatoire")
    private String ville;
    
    private String codePostal;
    
    @Positive(message = "Le nombre d'étages doit être positif")
    private int nombreEtages;
    
    @PositiveOrZero(message = "La surface totale doit être positive ou nulle")
    private double surfaceTotale;
    
    private Date dateConstruction;
    
    // Informations d'assurance
    private String numeroPoliceAssurance;
    private String compagnieAssurance;
    private Date dateExpirationAssurance;
    
    @NotNull(message = "L'ID du syndic est obligatoire")
    private Long syndicId;
    
    private List<String> equipements;
    private List<String> contactsUrgence;
}
