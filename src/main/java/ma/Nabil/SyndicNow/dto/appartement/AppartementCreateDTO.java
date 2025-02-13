package ma.Nabil.SyndicNow.dto.appartement;

import lombok.Data;
import ma.Nabil.SyndicNow.model.enums.TypeAppartement;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;

@Data
public class AppartementCreateDTO {
    @NotBlank(message = "Le numéro est obligatoire")
    private String numero;
    
    @PositiveOrZero(message = "L'étage doit être positif ou nul")
    private int etage;
    
    @Positive(message = "La surface doit être positive")
    private double surface;
    
    @NotNull(message = "Le type d'appartement est obligatoire")
    private TypeAppartement type;
    
    private boolean occupe;
    
    @NotNull(message = "L'ID de l'immeuble est obligatoire")
    private Long immeubleId;
    
    private Long proprietaireId;
    
    @Positive(message = "La quote-part doit être positive")
    private double quotePart;
    
    private int nombreOccupants;
    
    // Compteurs
    private String numeroCompteurEau;
    private String numeroCompteurElectricite;
    private Double dernierIndexEau;
    private Double dernierIndexElectricite;
}
