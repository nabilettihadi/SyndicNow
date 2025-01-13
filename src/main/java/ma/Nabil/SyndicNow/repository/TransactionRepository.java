package ma.Nabil.SyndicNow.repository;

import ma.Nabil.SyndicNow.model.entities.Appartement;
import ma.Nabil.SyndicNow.model.entities.Budget;
import ma.Nabil.SyndicNow.model.entities.Copropriétaire;
import ma.Nabil.SyndicNow.model.entities.Transaction;
import ma.Nabil.SyndicNow.model.enums.TypeTransaction;
import ma.Nabil.SyndicNow.model.enums.StatutTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    Optional<Transaction> findByReference(String reference);
    List<Transaction> findByType(TypeTransaction type);
    List<Transaction> findByStatut(StatutTransaction statut);
    List<Transaction> findByAppartement(Appartement appartement);
    List<Transaction> findByCopropriétaire(Copropriétaire copropriétaire);
    List<Transaction> findByBudget(Budget budget);
    List<Transaction> findByDateTransactionBetween(Date debut, Date fin);
    List<Transaction> findByMontantGreaterThan(double montant);
    List<Transaction> findByPeriode(String periode);
    List<Transaction> findByTypeAndStatut(TypeTransaction type, StatutTransaction statut);
}
