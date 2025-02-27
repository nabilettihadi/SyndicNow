package ma.Nabil.SyndicNow.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import ma.Nabil.SyndicNow.enums.StatutPaiement;
import ma.Nabil.SyndicNow.enums.TypePaiement;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaiementDTO {
    private Long id;
    private String reference;

    @NotNull(message = "Le montant est obligatoire")
    @Positive(message = "Le montant doit être positif")
    private BigDecimal montant;

    @NotNull(message = "La date de paiement est obligatoire")
    private LocalDate datePaiement;

    private LocalDate dateEcheance;

    @NotNull(message = "Le type de paiement est obligatoire")
    private TypePaiement type;

    private StatutPaiement statut;
    private String description;

    @NotNull(message = "L'ID de l'appartement est obligatoire")
    private Long appartementId;
}
