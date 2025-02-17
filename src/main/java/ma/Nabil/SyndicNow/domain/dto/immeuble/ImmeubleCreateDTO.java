package ma.Nabil.SyndicNow.domain.dto.immeuble;

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
public class ImmeubleCreateDTO {
    @NotBlank(message = "Le nom est obligatoire")
    private String nom;

    @NotBlank(message = "L'adresse est obligatoire")
    private String adresse;

    private String ville;
    private String codePostal;
    private String pays;

    @Positive(message = "Le nombre d'étages doit être positif")
    private Integer nombreEtages;

    @Positive(message = "Le nombre d'appartements doit être positif")
    private Integer nombreAppartements;

    @Positive(message = "La surface doit être positive")
    private Double surface;

    private String description;

    @NotNull(message = "L'ID du syndic est obligatoire")
    private Long syndicId;
}
