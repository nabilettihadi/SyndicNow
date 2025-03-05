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
public class BudgetResponse {
    private Long id;
    private Integer year;
    private BigDecimal totalAmount;
    private BudgetCategory category;
    private BigDecimal plannedExpenses;
    private BigDecimal actualExpenses;
    private BigDecimal income;
    private BigDecimal balance;
    private BigDecimal reserveFund;
    private BudgetStatus status;
    private LocalDateTime approvalDate;
    private Long approvedById;
    private String approvedByName;
    private Long immeubleId;
    private String immeubleName;
    private String description;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String createdBy;
    private String updatedBy;
} 