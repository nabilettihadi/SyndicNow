package ma.Nabil.SyndicNow.dto.paiement;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaiementCreateDTO {

    @NotNull(message = "L'ID de l'appartement ne peut pas être null")
    private Long appartementId;

    @NotNull(message = "La date de paiement ne peut pas être null")
    private LocalDate datePaiement;

    @NotNull(message = "Le montant ne peut pas être null")
    @Positive(message = "Le montant doit être positif")
    private Double montant;

    @NotNull(message = "Le mois ne peut pas être null")
    private Integer mois;

    @NotNull(message = "L'année ne peut pas être null")
    private Integer annee;

    private String description;

    private String methodePaiement;
} 