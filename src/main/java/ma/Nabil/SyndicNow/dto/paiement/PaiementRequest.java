package ma.Nabil.SyndicNow.dto.paiement;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import ma.Nabil.SyndicNow.enums.PaiementStatus;
import ma.Nabil.SyndicNow.enums.PaiementType;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaiementRequest {

    @NotNull(message = "Le montant est obligatoire")
    @DecimalMin(value = "0.01", message = "Le montant doit être supérieur à 0")
    private BigDecimal montant;

    @NotNull(message = "La date d'échéance est obligatoire")
    @FutureOrPresent(message = "La date d'échéance doit être dans le présent ou le futur")
    private LocalDate dateEcheance;

    private LocalDate datePaiement;

    @NotNull(message = "Le type de paiement est obligatoire")
    private PaiementType type;

    private PaiementStatus status;

    @NotNull(message = "L'ID de l'appartement est obligatoire")
    private Long appartementId;

    private String description;

    private String reference;
} 