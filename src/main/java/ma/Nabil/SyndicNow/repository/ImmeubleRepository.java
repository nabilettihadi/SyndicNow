package ma.Nabil.SyndicNow.repository;

import ma.Nabil.SyndicNow.entity.Immeuble;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ImmeubleRepository extends JpaRepository<Immeuble, Long> {
    @Query("SELECT i FROM Immeuble i WHERE i.syndic.id = :syndicId")
    List<Immeuble> findBySyndicId(@Param("syndicId") Long syndicId);
    
    @Query("SELECT i FROM Immeuble i WHERE " +
           "LOWER(i.nom) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(i.adresse) LIKE LOWER(CONCAT('%', :search, '%'))")
    Page<Immeuble> searchImmeubles(@Param("search") String search, Pageable pageable);
    
    @Query("SELECT i FROM Immeuble i LEFT JOIN FETCH i.appartements WHERE i.id = :id")
    Optional<Immeuble> findByIdWithAppartements(@Param("id") Long id);
    
    @Query("SELECT COUNT(a) FROM Immeuble i JOIN i.appartements a WHERE i.id = :immeubleId")
    long countAppartements(@Param("immeubleId") Long immeubleId);
    
    @Query("SELECT i FROM Immeuble i WHERE i.ville = :ville")
    List<Immeuble> findByVille(@Param("ville") String ville);
    
    @Query("SELECT DISTINCT i.ville FROM Immeuble i")
    List<String> findAllVilles();
    
    boolean existsByNomAndAdresse(String nom, String adresse);
    
    @Query("SELECT i FROM Immeuble i WHERE i.syndic.id = :syndicId AND " +
           "(:search IS NULL OR LOWER(i.nom) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(i.adresse) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Immeuble> findBySyndicIdAndSearch(@Param("syndicId") Long syndicId, 
                                          @Param("search") String search, 
                                          Pageable pageable);
}
