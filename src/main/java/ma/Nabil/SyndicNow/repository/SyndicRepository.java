package ma.Nabil.SyndicNow.repository;

import ma.Nabil.SyndicNow.model.entities.Syndic;
import ma.Nabil.SyndicNow.model.enums.StatutSyndic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SyndicRepository extends JpaRepository<Syndic, Long> {
    Optional<Syndic> findByEmail(String email);
    List<Syndic> findByStatut(StatutSyndic statut);
    
    @Query("SELECT s FROM Syndic s WHERE SIZE(s.immeubles) > :minImmeubles")
    List<Syndic> findSyndicsWithMinimumImmeubles(@Param("minImmeubles") int minImmeubles);
    
    @Query("SELECT s FROM Syndic s WHERE s.statut = 'ACTIF' AND SIZE(s.immeubles) = 0")
    List<Syndic> findActifsSansImmeuble();
    
    @Query("SELECT s FROM Syndic s JOIN s.immeubles i GROUP BY s HAVING COUNT(i) > (SELECT AVG(COUNT(i2)) FROM Syndic s2 JOIN s2.immeubles i2 GROUP BY s2)")
    List<Syndic> findSyndicsAboveAverageImmeubles();
    
    @Query(value = "SELECT s.* FROM syndic s " +
           "JOIN immeuble i ON i.syndic_id = s.id " +
           "GROUP BY s.id " +
           "ORDER BY COUNT(i.id) DESC LIMIT 5", nativeQuery = true)
    List<Syndic> findTop5SyndicsByImmeubleCount();
}
