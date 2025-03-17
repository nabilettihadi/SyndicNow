package ma.Nabil.SyndicNow.dto.appartement;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AppartementRequest {
    @NotBlank(message = "Le numéro est obligatoire")
    private String numero;

    @NotNull(message = "L'étage est obligatoire")
    private Integer etage;

    @NotNull(message = "La superficie est obligatoire")
    @Positive(message = "La superficie doit être positive")
    private Double superficie;

    @NotNull(message = "L'ID de l'immeuble est obligatoire")
    private Long immeubleId;

    private Set<Long> proprietaireIds;
    private String description;
} 