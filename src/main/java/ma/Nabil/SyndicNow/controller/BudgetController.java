package ma.Nabil.SyndicNow.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import ma.Nabil.SyndicNow.dto.budget.BudgetRequest;
import ma.Nabil.SyndicNow.dto.budget.BudgetResponse;
import ma.Nabil.SyndicNow.enums.BudgetStatus;
import ma.Nabil.SyndicNow.service.BudgetService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/budgets")
@RequiredArgsConstructor
public class BudgetController {

    private final BudgetService budgetService;

    @PostMapping
    @PreAuthorize("hasRole('SYNDIC')")
    public ResponseEntity<BudgetResponse> createBudget(@Valid @RequestBody BudgetRequest request) {
        return ResponseEntity.ok(budgetService.createBudget(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('SYNDIC')")
    public ResponseEntity<BudgetResponse> updateBudget(@PathVariable Long id, @Valid @RequestBody BudgetRequest request) {
        return ResponseEntity.ok(budgetService.updateBudget(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SYNDIC')")
    public ResponseEntity<Void> deleteBudget(@PathVariable Long id) {
        budgetService.deleteBudget(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<BudgetResponse> getBudgetById(@PathVariable Long id) {
        return ResponseEntity.ok(budgetService.getBudgetById(id));
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<BudgetResponse>> getAllBudgets() {
        return ResponseEntity.ok(budgetService.getAllBudgets());
    }

    @GetMapping("/immeuble/{immeubleId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<BudgetResponse>> getBudgetsByImmeubleId(@PathVariable Long immeubleId) {
        return ResponseEntity.ok(budgetService.getBudgetsByImmeubleId(immeubleId));
    }

    @GetMapping("/year/{year}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<BudgetResponse>> getBudgetsByYear(@PathVariable Integer year) {
        return ResponseEntity.ok(budgetService.getBudgetsByYear(year));
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<BudgetResponse>> getBudgetsByStatus(@PathVariable BudgetStatus status) {
        return ResponseEntity.ok(budgetService.getBudgetsByStatus(status));
    }

    @PutMapping("/{id}/status/{status}")
    @PreAuthorize("hasRole('SYNDIC')")
    public ResponseEntity<BudgetResponse> updateBudgetStatus(@PathVariable Long id, @PathVariable BudgetStatus status) {
        return ResponseEntity.ok(budgetService.updateBudgetStatus(id, status));
    }

    @PutMapping("/{id}/actual-expenses")
    @PreAuthorize("hasRole('SYNDIC')")
    public ResponseEntity<BudgetResponse> updateActualExpenses(@PathVariable Long id, @RequestParam BigDecimal actualExpenses) {
        return ResponseEntity.ok(budgetService.updateActualExpenses(id, actualExpenses));
    }

    @GetMapping("/{id}/balance")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<BigDecimal> calculateBalance(@PathVariable Long id) {
        return ResponseEntity.ok(budgetService.calculateBalance(id));
    }

    @PutMapping("/{id}/validate")
    @PreAuthorize("hasRole('SYNDIC')")
    public ResponseEntity<Void> validateBudget(@PathVariable Long id) {
        budgetService.validateBudget(id);
        return ResponseEntity.ok().build();
    }
} 