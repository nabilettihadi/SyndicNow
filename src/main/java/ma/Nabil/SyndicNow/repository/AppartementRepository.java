package ma.Nabil.SyndicNow.repository;

import ma.Nabil.SyndicNow.entity.Appartement;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AppartementRepository extends JpaRepository<Appartement, Long> {
    @Query("SELECT a FROM Appartement a WHERE a.immeuble.id = :immeubleId")
    List<Appartement> findByImmeubleId(@Param("immeubleId") Long immeubleId);

    @Query("SELECT a FROM Appartement a WHERE a.proprietaire.id = :proprietaireId")
    List<Appartement> findByProprietaireId(@Param("proprietaireId") Long proprietaireId);

    @Query("SELECT a FROM Appartement a WHERE " + 
           "LOWER(CAST(a.numero AS string)) LIKE LOWER(CONCAT('%', :search, '%')) OR " + 
           "LOWER(CAST(a.etage AS string)) LIKE LOWER(CONCAT('%', :search, '%'))")
    Page<Appartement> searchAppartements(@Param("search") String search, Pageable pageable);

    @Query("SELECT a FROM Appartement a WHERE a.immeuble.syndic.id = :syndicId")
    List<Appartement> findBySyndicId(@Param("syndicId") Long syndicId);

    boolean existsByNumeroAndImmeubleId(String numero, Long immeubleId);

    @Query("SELECT COUNT(a) FROM Appartement a WHERE a.immeuble.id = :immeubleId AND a.proprietaire IS NOT NULL")
    long countOccupiedAppartements(@Param("immeubleId") Long immeubleId);

    @Query("SELECT a FROM Appartement a WHERE a.immeuble.id = :immeubleId AND a.proprietaire IS NULL")
    List<Appartement> findAvailableByImmeubleId(@Param("immeubleId") Long immeubleId);

    @Query("SELECT a FROM Appartement a WHERE a.immeuble.id = :immeubleId AND " + 
           "(:search IS NULL OR LOWER(CAST(a.numero AS string)) LIKE LOWER(CONCAT('%', :search, '%')) OR " + 
           "LOWER(CAST(a.etage AS string)) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Appartement> findByImmeubleIdAndSearch(@Param("immeubleId") Long immeubleId, @Param("search") String search, Pageable pageable);
}
