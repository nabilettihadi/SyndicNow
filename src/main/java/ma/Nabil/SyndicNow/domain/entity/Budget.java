package ma.Nabil.SyndicNow.domain.entity;

import jakarta.persistence.*;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import ma.Nabil.SyndicNow.domain.enums.BudgetCategory;
import ma.Nabil.SyndicNow.domain.enums.BudgetStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Table(name = "budgets")
public class Budget extends BaseEntity {

    @Column(nullable = false)
    private Integer year;

    @Column(nullable = false)
    private BigDecimal totalAmount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BudgetCategory category;

    @Column(nullable = false)
    private BigDecimal plannedExpenses;

    @Column(nullable = false)
    private BigDecimal actualExpenses;

    @Column(nullable = false)
    private BigDecimal income;

    @Column(nullable = false)
    private BigDecimal balance;

    @Column(nullable = false)
    private BigDecimal reserveFund;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BudgetStatus status;

    private LocalDateTime approvalDate;

    @ManyToOne
    @JoinColumn(name = "approved_by_id")
    private Syndic approvedBy;

    @ManyToOne
    @JoinColumn(name = "immeuble_id", nullable = false)
    private Immeuble immeuble;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String notes;
}
