package ma.Nabil.SyndicNow.dto.budget;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import ma.Nabil.SyndicNow.enums.BudgetCategory;
import ma.Nabil.SyndicNow.enums.BudgetStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BudgetCreateDTO {
    private String titre;
    private String description;
    private BigDecimal montant;
    private LocalDateTime dateDebut;
    private LocalDateTime dateFin;
    private BudgetCategory category;
    private Long immeubleId;
    private String notes;
}
