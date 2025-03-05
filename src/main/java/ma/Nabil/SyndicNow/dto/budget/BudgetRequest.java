package ma.Nabil.SyndicNow.dto.budget;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import ma.Nabil.SyndicNow.enums.BudgetCategory;
import ma.Nabil.SyndicNow.enums.BudgetStatus;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BudgetRequest {
    @NotNull(message = "L'année est obligatoire")
    private Integer year;

    @NotNull(message = "Le montant total est obligatoire")
    @Positive(message = "Le montant total doit être positif")
    private BigDecimal totalAmount;

    @NotNull(message = "La catégorie est obligatoire")
    private BudgetCategory category;

    @NotNull(message = "Les dépenses prévues sont obligatoires")
    @Positive(message = "Les dépenses prévues doivent être positives")
    private BigDecimal plannedExpenses;

    @Positive(message = "Les dépenses réelles doivent être positives")
    private BigDecimal actualExpenses;

    @NotNull(message = "Les revenus sont obligatoires")
    @Positive(message = "Les revenus doivent être positifs")
    private BigDecimal income;

    @NotNull(message = "Le fonds de réserve est obligatoire")
    @Positive(message = "Le fonds de réserve doit être positif")
    private BigDecimal reserveFund;

    private BudgetStatus status;

    @NotNull(message = "L'ID de l'immeuble est obligatoire")
    private Long immeubleId;

    private String description;
    private String notes;
} 