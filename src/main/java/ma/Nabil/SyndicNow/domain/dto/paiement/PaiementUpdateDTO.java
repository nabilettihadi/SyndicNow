package ma.Nabil.SyndicNow.domain.dto.paiement;

import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import ma.Nabil.SyndicNow.domain.enums.StatutPaiement;
import ma.Nabil.SyndicNow.domain.enums.TypePaiement;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaiementUpdateDTO {
    @Positive(message = "Le montant doit être positif")
    private BigDecimal montant;

    private LocalDate datePaiement;
    private LocalDate dateEcheance;
    private TypePaiement type;
    private StatutPaiement statut;
    private String description;
}
