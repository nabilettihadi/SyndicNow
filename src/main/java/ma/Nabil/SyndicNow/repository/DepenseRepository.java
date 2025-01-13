package ma.Nabil.SyndicNow.repository;

import ma.Nabil.SyndicNow.model.entities.Budget;
import ma.Nabil.SyndicNow.model.entities.Depense;
import ma.Nabil.SyndicNow.model.entities.Immeuble;
import ma.Nabil.SyndicNow.model.enums.TypeDepense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface DepenseRepository extends JpaRepository<Depense, Long> {
    List<Depense> findByType(TypeDepense type);
    List<Depense> findByBudget(Budget budget);
    List<Depense> findByImmeuble(Immeuble immeuble);
    List<Depense> findByDateBetween(Date debut, Date fin);
    List<Depense> findByMontantGreaterThan(double montant);
    List<Depense> findByValideeTrue();
}
