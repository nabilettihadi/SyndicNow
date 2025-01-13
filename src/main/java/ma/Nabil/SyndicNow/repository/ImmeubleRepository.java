package ma.Nabil.SyndicNow.repository;

import ma.Nabil.SyndicNow.model.entities.Immeuble;
import ma.Nabil.SyndicNow.model.entities.Syndic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface ImmeubleRepository extends JpaRepository<Immeuble, Long> {
    List<Immeuble> findBySyndic(Syndic syndic);
    List<Immeuble> findByVille(String ville);
    
    @Query("SELECT i FROM Immeuble i WHERE i.dateExpirationAssurance < :date")
    List<Immeuble> findByAssuranceExpiree(@Param("date") Date date);
    
    @Query("SELECT i FROM Immeuble i WHERE SIZE(i.appartements) > :minAppartements")
    List<Immeuble> findByMinimumAppartements(@Param("minAppartements") int minAppartements);
    
    @Query("SELECT i FROM Immeuble i LEFT JOIN i.budgets b WHERE b IS NULL OR b.annee = :annee")
    List<Immeuble> findImmeublesWithoutBudgetForYear(@Param("annee") int annee);
    
    @Query("SELECT i FROM Immeuble i WHERE SIZE(i.appartements) = (SELECT MAX(SIZE(i2.appartements)) FROM Immeuble i2)")
    List<Immeuble> findImmeubleWithMostAppartements();
    
    @Query(value = "SELECT i.* FROM immeuble i " +
           "JOIN appartement a ON a.immeuble_id = i.id " +
           "GROUP BY i.id " +
           "HAVING COUNT(a.id) > (SELECT AVG(appt_count) FROM " +
           "(SELECT COUNT(a2.id) as appt_count FROM immeuble i2 " +
           "JOIN appartement a2 ON a2.immeuble_id = i2.id GROUP BY i2.id) as counts)", 
           nativeQuery = true)
    List<Immeuble> findImmeublesAboveAverageAppartements();
}
