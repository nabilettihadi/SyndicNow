package ma.Nabil.SyndicNow.repository;

import ma.Nabil.SyndicNow.entity.Budget;
import ma.Nabil.SyndicNow.enums.BudgetStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BudgetRepository extends JpaRepository<Budget, Long> {
    List<Budget> findByImmeubleId(Long immeubleId);

    List<Budget> findByYear(Integer year);

    List<Budget> findByStatus(BudgetStatus status);
} 