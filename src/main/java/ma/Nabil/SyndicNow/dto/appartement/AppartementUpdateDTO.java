package ma.Nabil.SyndicNow.dto;

import lombok.Data;
import ma.Nabil.SyndicNow.model.enums.TypeAppartement;

import javax.validation.constraints.Positive;
import javax.validation.constraints.PositiveOrZero;

@Data
public class AppartementUpdateDTO {
    private Long id;
    private String numero;
    
    @PositiveOrZero(message = "L'étage doit être positif ou nul")
    private Integer etage;
    
    @Positive(message = "La surface doit être positive")
    private Double surface;
    
    private TypeAppartement type;
    private Boolean occupe;
    private Long proprietaireId;
    
    @Positive(message = "La quote-part doit être positive")
    private Double quotePart;
    
    private Integer nombreOccupants;
    
    // Compteurs
    private String numeroCompteurEau;
    private String numeroCompteurElectricite;
    private Double dernierIndexEau;
    private Double dernierIndexElectricite;
}
