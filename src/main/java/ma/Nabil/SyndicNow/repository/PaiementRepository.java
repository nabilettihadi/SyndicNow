package ma.Nabil.SyndicNow.repository;

import ma.Nabil.SyndicNow.entity.Paiement;
import ma.Nabil.SyndicNow.enums.PaiementStatus;
import ma.Nabil.SyndicNow.enums.PaiementType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PaiementRepository extends JpaRepository<Paiement, Long> {
    Optional<Paiement> findByReference(String reference);

    Page<Paiement> findByAppartementId(Long appartementId, Pageable pageable);

    Page<Paiement> findByStatus(PaiementStatus status, Pageable pageable);

    Page<Paiement> findByType(PaiementType type, Pageable pageable);

    @Query("SELECT p FROM Paiement p WHERE p.dateEcheance < :date AND p.status = 'EN_ATTENTE'")
    List<Paiement> findOverduePaiements(LocalDate date);

    @Query("SELECT p FROM Paiement p WHERE p.appartement.immeuble.id = :immeubleId")
    Page<Paiement> findByImmeubleId(Long immeubleId, Pageable pageable);

    @Query("SELECT SUM(p.montant) FROM Paiement p WHERE p.status = :status AND p.appartement.id = :appartementId")
    Double getTotalPaiementsByStatusAndAppartement(PaiementStatus status, Long appartementId);

    @Query("SELECT SUM(p.montant) FROM Paiement p WHERE p.status = :status AND p.appartement.immeuble.id = :immeubleId")
    Double getTotalPaiementsByStatusAndImmeuble(PaiementStatus status, Long immeubleId);

    @Query("SELECT p FROM Paiement p WHERE p.appartement.id = :appartementId")
    List<Paiement> findByAppartementId(@Param("appartementId") Long appartementId);

    @Query("SELECT p FROM Paiement p WHERE p.appartement.immeuble.id = :immeubleId")
    List<Paiement> findByImmeubleId(@Param("immeubleId") Long immeubleId);

    @Query("SELECT p FROM Paiement p WHERE p.appartement.proprietaire.id = :proprietaireId")
    List<Paiement> findByProprietaireId(@Param("proprietaireId") Long proprietaireId);

    @Query("SELECT p FROM Paiement p WHERE p.datePaiement BETWEEN :debut AND :fin")
    List<Paiement> findByPeriode(@Param("debut") LocalDateTime debut, @Param("fin") LocalDateTime fin);

    @Query("SELECT SUM(p.montant) FROM Paiement p WHERE p.appartement.immeuble.id = :immeubleId")
    Double getTotalPaiementsByImmeuble(@Param("immeubleId") Long immeubleId);

    @Query("SELECT p FROM Paiement p WHERE p.appartement.immeuble.syndic.id = :syndicId")
    List<Paiement> findBySyndicId(@Param("syndicId") Long syndicId);

    @Query("SELECT p FROM Paiement p WHERE " +
            "p.appartement.immeuble.syndic.id = :syndicId AND " +
            "p.datePaiement BETWEEN :debut AND :fin")
    Page<Paiement> findBySyndicIdAndPeriode(
            @Param("syndicId") Long syndicId,
            @Param("debut") LocalDateTime debut,
            @Param("fin") LocalDateTime fin,
            Pageable pageable);

    @Query("SELECT COALESCE(SUM(p.montant), 0) FROM Paiement p WHERE " +
            "p.appartement.proprietaire.id = :proprietaireId AND " +
            "p.datePaiement BETWEEN :debut AND :fin")
    Double getTotalPaiementsByProprietaireAndPeriode(
            @Param("proprietaireId") Long proprietaireId,
            @Param("debut") LocalDateTime debut,
            @Param("fin") LocalDateTime fin);
}
