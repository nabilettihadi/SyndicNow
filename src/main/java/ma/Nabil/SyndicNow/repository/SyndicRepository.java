package ma.Nabil.SyndicNow.repository;

import ma.Nabil.SyndicNow.entity.Syndic;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface SyndicRepository extends JpaRepository<Syndic, Long> {
    Optional<Syndic> findByEmail(String email);

    boolean existsByEmail(String email);

    Optional<Syndic> findByCin(String cin);

    Optional<Syndic> findByNumeroLicence(String numeroLicence);

    @Query("SELECT s FROM Syndic s WHERE s.dateDebutActivite >= :startDate")
    List<Syndic> findAllActiveSince(@Param("startDate") LocalDateTime startDate);

    @Query("SELECT s FROM Syndic s WHERE " + "LOWER(s.nom) LIKE LOWER(CONCAT('%', :search, '%')) OR " + "LOWER(s.prenom) LIKE LOWER(CONCAT('%', :search, '%')) OR " + "LOWER(s.email) LIKE LOWER(CONCAT('%', :search, '%')) OR " + "LOWER(s.societe) LIKE LOWER(CONCAT('%', :search, '%'))")
    Page<Syndic> searchSyndics(@Param("search") String search, Pageable pageable);

    @Query("SELECT s FROM Syndic s LEFT JOIN FETCH s.immeubles WHERE s.id = :id")
    Optional<Syndic> findByIdWithImmeubles(@Param("id") Long id);

    @Query("SELECT COUNT(i) FROM Syndic s JOIN s.immeubles i WHERE s.id = :syndicId")
    long countImmeubles(@Param("syndicId") Long syndicId);

    boolean existsBySiret(String siret);

    @Query("SELECT s FROM Syndic s WHERE s.societe = :societe")
    List<Syndic> findBySociete(@Param("societe") String societe);
}
