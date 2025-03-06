package ma.Nabil.SyndicNow.service;

import ma.Nabil.SyndicNow.dto.budget.BudgetRequest;
import ma.Nabil.SyndicNow.dto.budget.BudgetResponse;
import ma.Nabil.SyndicNow.enums.BudgetStatus;

import java.math.BigDecimal;
import java.util.List;

public interface BudgetService {
    BudgetResponse createBudget(BudgetRequest request);

    BudgetResponse updateBudget(Long id, BudgetRequest request);

    void deleteBudget(Long id);

    BudgetResponse getBudgetById(Long id);

    List<BudgetResponse> getAllBudgets();

    List<BudgetResponse> getBudgetsByImmeubleId(Long immeubleId);

    List<BudgetResponse> getBudgetsByYear(Integer year);

    List<BudgetResponse> getBudgetsByStatus(BudgetStatus status);

    BudgetResponse updateBudgetStatus(Long id, BudgetStatus status);

    BudgetResponse updateActualExpenses(Long id, BigDecimal actualExpenses);

    BigDecimal calculateBalance(Long id);

    void validateBudget(Long id);
} 