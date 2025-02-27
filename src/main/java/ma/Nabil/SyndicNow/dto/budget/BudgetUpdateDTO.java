package ma.Nabil.SyndicNow.dto.budget;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import ma.Nabil.SyndicNow.enums.BudgetStatus;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BudgetUpdateDTO {
    private Long id;
    private String titre;
    private String description;
    private BigDecimal montant;
    private BudgetStatus status;
    private String notes;
}
