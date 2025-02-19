package ma.Nabil.SyndicNow.repository;

import ma.Nabil.SyndicNow.domain.entity.Paiement;
import ma.Nabil.SyndicNow.domain.enums.StatutPaiement;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PaiementRepository extends BaseRepository<Paiement, Long> {
    List<Paiement> findByAppartementId(Long appartementId);

    @Query("SELECT p FROM Paiement p WHERE p.appartement.immeuble.syndic.id = :syndicId")
    Page<Paiement> findAllBySyndicId(Long syndicId, Pageable pageable);

    @Query("SELECT p FROM Paiement p WHERE p.appartement.proprietaire.id = :proprietaireId")
    Page<Paiement> findAllByProprietaireId(Long proprietaireId, Pageable pageable);

    List<Paiement> findByStatutAndDateEcheanceBefore(StatutPaiement statut, LocalDate date);

    boolean existsByReference(String reference);
}
