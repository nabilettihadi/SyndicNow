package ma.Nabil.SyndicNow.dto.appartement;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AppartementUpdateDTO {

    @NotBlank(message = "Le numéro d'appartement ne peut pas être vide")
    private String numero;

    @NotNull(message = "L'étage ne peut pas être null")
    private Integer etage;

    @NotNull(message = "La superficie ne peut pas être null")
    private Double superficie;

    private String description;

    @NotNull(message = "L'ID de l'immeuble ne peut pas être null")
    private Long immeubleId;

    private Long proprietaireId;

    @NotNull(message = "Le statut d'occupation ne peut pas être null")
    private Boolean estOccupe;
} 