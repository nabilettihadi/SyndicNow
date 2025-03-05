package ma.Nabil.SyndicNow.service.impl;

import lombok.RequiredArgsConstructor;
import ma.Nabil.SyndicNow.dto.budget.BudgetRequest;
import ma.Nabil.SyndicNow.dto.budget.BudgetResponse;
import ma.Nabil.SyndicNow.entity.Budget;
import ma.Nabil.SyndicNow.entity.Immeuble;
import ma.Nabil.SyndicNow.entity.Syndic;
import ma.Nabil.SyndicNow.enums.BudgetStatus;
import ma.Nabil.SyndicNow.exception.InvalidOperationException;
import ma.Nabil.SyndicNow.exception.ResourceNotFoundException;
import ma.Nabil.SyndicNow.repository.BudgetRepository;
import ma.Nabil.SyndicNow.repository.ImmeubleRepository;
import ma.Nabil.SyndicNow.service.BudgetService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BudgetServiceImpl implements BudgetService {

    private final BudgetRepository budgetRepository;
    private final ImmeubleRepository immeubleRepository;

    @Override
    @Transactional
    public BudgetResponse createBudget(BudgetRequest request) {
        Immeuble immeuble = immeubleRepository.findById(request.getImmeubleId())
                .orElseThrow(() -> new ResourceNotFoundException("Immeuble non trouvé"));

        Budget budget = Budget.builder()
                .year(request.getYear())
                .totalAmount(request.getTotalAmount())
                .category(request.getCategory())
                .plannedExpenses(request.getPlannedExpenses())
                .actualExpenses(BigDecimal.ZERO)
                .income(request.getIncome())
                .balance(request.getIncome().subtract(request.getPlannedExpenses()))
                .reserveFund(request.getReserveFund())
                .status(BudgetStatus.EN_ATTENTE)
                .immeuble(immeuble)
                .description(request.getDescription())
                .notes(request.getNotes())
                .build();

        budget = budgetRepository.save(budget);
        return mapToResponse(budget);
    }

    @Override
    @Transactional
    public BudgetResponse updateBudget(Long id, BudgetRequest request) {
        Budget budget = budgetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Budget non trouvé"));

        if (budget.getStatus() == BudgetStatus.APPROUVE) {
            throw new InvalidOperationException("Impossible de modifier un budget approuvé");
        }

        Immeuble immeuble = immeubleRepository.findById(request.getImmeubleId())
                .orElseThrow(() -> new ResourceNotFoundException("Immeuble non trouvé"));

        budget.setYear(request.getYear());
        budget.setTotalAmount(request.getTotalAmount());
        budget.setCategory(request.getCategory());
        budget.setPlannedExpenses(request.getPlannedExpenses());
        budget.setIncome(request.getIncome());
        budget.setBalance(request.getIncome().subtract(budget.getActualExpenses()));
        budget.setReserveFund(request.getReserveFund());
        budget.setImmeuble(immeuble);
        budget.setDescription(request.getDescription());
        budget.setNotes(request.getNotes());

        budget = budgetRepository.save(budget);
        return mapToResponse(budget);
    }

    @Override
    @Transactional
    public void deleteBudget(Long id) {
        Budget budget = budgetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Budget non trouvé"));

        if (budget.getStatus() == BudgetStatus.APPROUVE) {
            throw new InvalidOperationException("Impossible de supprimer un budget approuvé");
        }

        budgetRepository.delete(budget);
    }

    @Override
    @Transactional(readOnly = true)
    public BudgetResponse getBudgetById(Long id) {
        Budget budget = budgetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Budget non trouvé"));
        return mapToResponse(budget);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BudgetResponse> getAllBudgets() {
        return budgetRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<BudgetResponse> getBudgetsByImmeubleId(Long immeubleId) {
        return budgetRepository.findByImmeubleId(immeubleId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<BudgetResponse> getBudgetsByYear(Integer year) {
        return budgetRepository.findByYear(year).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<BudgetResponse> getBudgetsByStatus(BudgetStatus status) {
        return budgetRepository.findByStatus(status).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public BudgetResponse updateBudgetStatus(Long id, BudgetStatus status) {
        Budget budget = budgetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Budget non trouvé"));

        if (budget.getStatus() == BudgetStatus.APPROUVE && status != BudgetStatus.APPROUVE) {
            throw new InvalidOperationException("Impossible de modifier le statut d'un budget approuvé");
        }

        budget.setStatus(status);
        if (status == BudgetStatus.APPROUVE) {
            budget.setApprovalDate(LocalDateTime.now());
        }

        budget = budgetRepository.save(budget);
        return mapToResponse(budget);
    }

    @Override
    @Transactional
    public BudgetResponse updateActualExpenses(Long id, BigDecimal actualExpenses) {
        Budget budget = budgetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Budget non trouvé"));

        budget.setActualExpenses(actualExpenses);
        budget.setBalance(budget.getIncome().subtract(actualExpenses));

        budget = budgetRepository.save(budget);
        return mapToResponse(budget);
    }

    @Override
    @Transactional(readOnly = true)
    public BigDecimal calculateBalance(Long id) {
        Budget budget = budgetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Budget non trouvé"));
        return budget.getIncome().subtract(budget.getActualExpenses());
    }

    @Override
    @Transactional
    public void validateBudget(Long id) {
        Budget budget = budgetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Budget non trouvé"));

        if (budget.getStatus() == BudgetStatus.APPROUVE) {
            throw new InvalidOperationException("Le budget est déjà approuvé");
        }

        if (budget.getPlannedExpenses().compareTo(budget.getTotalAmount()) > 0) {
            throw new InvalidOperationException("Les dépenses prévues ne peuvent pas dépasser le montant total");
        }

        budget.setStatus(BudgetStatus.APPROUVE);
        budget.setApprovalDate(LocalDateTime.now());
        budgetRepository.save(budget);
    }

    private BudgetResponse mapToResponse(Budget budget) {
        return BudgetResponse.builder()
                .id(budget.getId())
                .year(budget.getYear())
                .totalAmount(budget.getTotalAmount())
                .category(budget.getCategory())
                .plannedExpenses(budget.getPlannedExpenses())
                .actualExpenses(budget.getActualExpenses())
                .income(budget.getIncome())
                .balance(budget.getBalance())
                .reserveFund(budget.getReserveFund())
                .status(budget.getStatus())
                .approvalDate(budget.getApprovalDate())
                .approvedById(budget.getApprovedBy() != null ? budget.getApprovedBy().getId() : null)
                .approvedByName(budget.getApprovedBy() != null ? budget.getApprovedBy().getNom() + " " + budget.getApprovedBy().getPrenom() : null)
                .immeubleId(budget.getImmeuble().getId())
                .immeubleName(budget.getImmeuble().getNom())
                .description(budget.getDescription())
                .notes(budget.getNotes())
                .createdAt(budget.getCreatedAt())
                .updatedAt(budget.getUpdatedAt())
                .createdBy(budget.getCreatedBy())
                .updatedBy(budget.getUpdatedBy())
                .build();
    }
} 