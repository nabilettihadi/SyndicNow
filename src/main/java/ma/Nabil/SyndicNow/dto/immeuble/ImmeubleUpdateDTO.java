package ma.Nabil.SyndicNow.dto.immeuble;

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
public class ImmeubleUpdateDTO {

    @NotBlank(message = "Le nom ne peut pas être vide")
    private String nom;

    @NotBlank(message = "L'adresse ne peut pas être vide")
    private String adresse;

    @NotNull(message = "Le nombre d'étages ne peut pas être null")
    private Integer nombreEtages;

    @NotNull(message = "Le nombre d'appartements ne peut pas être null")
    private Integer nombreAppartements;

    private String description;

    private Long syndicId;
} 