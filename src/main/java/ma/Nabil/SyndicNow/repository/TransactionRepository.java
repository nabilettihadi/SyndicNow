package ma.Nabil.SyndicNow.repository;

import ma.Nabil.SyndicNow.model.entities.Transaction;
import ma.Nabil.SyndicNow.model.entities.Appartement;
import ma.Nabil.SyndicNow.model.entities.Budget;
import ma.Nabil.SyndicNow.model.enums.TypeTransaction;
import ma.Nabil.SyndicNow.model.enums.StatutTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByType(TypeTransaction type);
    List<Transaction> findByStatut(StatutTransaction statut);
    List<Transaction> findByAppartement(Appartement appartement);
    
    @Query("SELECT t FROM Transaction t WHERE t.dateEcheance < :date AND t.statut = 'EN_ATTENTE'")
    List<Transaction> findTransactionsEnRetard(@Param("date") Date date);
    
    @Query("SELECT t FROM Transaction t WHERE t.budget = :budget AND t.montant > (SELECT AVG(t2.montant) FROM Transaction t2 WHERE t2.budget = :budget)")
    List<Transaction> findTransactionsAboveAverageForBudget(@Param("budget") Budget budget);
    
    @Query("SELECT SUM(t.montant) FROM Transaction t WHERE t.type = :type AND t.dateTransaction BETWEEN :debut AND :fin")
    Double calculateTotalForPeriod(@Param("type") TypeTransaction type, @Param("debut") Date debut, @Param("fin") Date fin);
    
    @Query("SELECT t.periode, COUNT(t) as count, SUM(t.montant) as total FROM Transaction t " +
           "WHERE t.type = 'COTISATION' GROUP BY t.periode ORDER BY t.periode DESC")
    List<Object[]> getCotisationStatsByPeriode();
    
    @Query(value = "SELECT EXTRACT(MONTH FROM date_transaction) as mois, " +
           "SUM(CASE WHEN type = 'COTISATION' THEN montant ELSE 0 END) as revenus, " +
           "SUM(CASE WHEN type = 'DEPENSE' THEN montant ELSE 0 END) as depenses " +
           "FROM transaction " +
           "WHERE EXTRACT(YEAR FROM date_transaction) = :annee " +
           "GROUP BY EXTRACT(MONTH FROM date_transaction)", 
           nativeQuery = true)
    List<Object[]> getBilanMensuel(@Param("annee") int annee);
}
