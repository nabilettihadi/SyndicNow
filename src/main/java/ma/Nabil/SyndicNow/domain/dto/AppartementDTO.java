package ma.Nabil.SyndicNow.domain.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AppartementDTO {
    private Long id;

    @NotBlank(message = "Le numéro est obligatoire")
    private String numero;

    @Positive(message = "L'étage doit être positif")
    private Integer etage;

    @Positive(message = "La surface doit être positive")
    private Double surface;

    @Positive(message = "Le nombre de pièces doit être positif")
    private Integer nombrePieces;

    private String type;
    private String description;

    @NotNull(message = "L'ID de l'immeuble est obligatoire")
    private Long immeubleId;

    private Long proprietaireId;
}
