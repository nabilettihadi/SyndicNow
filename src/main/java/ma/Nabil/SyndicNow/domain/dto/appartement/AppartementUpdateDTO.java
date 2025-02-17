package ma.Nabil.SyndicNow.domain.dto.appartement;

import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AppartementUpdateDTO {
    private String numero;

    @Positive(message = "L'étage doit être positif")
    private Integer etage;

    @Positive(message = "La surface doit être positive")
    private Double surface;

    @Positive(message = "Le nombre de pièces doit être positif")
    private Integer nombrePieces;

    private String type;
    private String description;
    private Long proprietaireId;
}
