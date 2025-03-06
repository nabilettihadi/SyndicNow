package ma.Nabil.SyndicNow.dto.immeuble;

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
public class ImmeubleRequest {
    @NotBlank(message = "Le nom est obligatoire")
    private String nom;

    @NotBlank(message = "L'adresse est obligatoire")
    private String adresse;

    @NotNull(message = "Le nombre d'étages est obligatoire")
    @Positive(message = "Le nombre d'étages doit être positif")
    private Integer nombreEtages;

    @NotNull(message = "Le nombre d'appartements est obligatoire")
    @Positive(message = "Le nombre d'appartements doit être positif")
    private Integer nombreAppartements;

    private Long syndicId;
    private String description;
} 