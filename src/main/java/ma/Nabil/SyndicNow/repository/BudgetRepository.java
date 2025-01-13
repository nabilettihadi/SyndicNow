package ma.Nabil.SyndicNow.repository;

import ma.Nabil.SyndicNow.model.entities.Budget;
import ma.Nabil.SyndicNow.model.entities.Immeuble;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BudgetRepository extends JpaRepository<Budget, Long> {
    List<Budget> findByImmeuble(Immeuble immeuble);
    Optional<Budget> findByImmeubleAndAnnee(Immeuble immeuble, int annee);
    List<Budget> findByMontantPrevisionnelGreaterThan(double montant);
    List<Budget> findByAnnee(int annee);
}
