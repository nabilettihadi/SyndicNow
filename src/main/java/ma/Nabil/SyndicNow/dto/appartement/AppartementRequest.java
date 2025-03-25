package ma.Nabil.SyndicNow.dto.appartement;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Max;
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

    @NotNull(message = "La surface est obligatoire")
    @Positive(message = "La surface doit être positive")
    private Double surface;

    @NotNull(message = "Le nombre de pièces est obligatoire")
    @Positive(message = "Le nombre de pièces doit être positif")
    @Max(value = 20, message = "Le nombre de pièces ne peut pas dépasser 20")
    private Integer nombrePieces;

    @NotNull(message = "L'ID de l'immeuble est obligatoire")
    private Long immeubleId;

    private Set<Long> proprietaireIds;
    private String description;
} 