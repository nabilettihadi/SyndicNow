package ma.Nabil.SyndicNow.repository;

import ma.Nabil.SyndicNow.domain.entity.Appartement;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AppartementRepository extends BaseRepository<Appartement, Long> {
    List<Appartement> findByImmeubleId(Long immeubleId);

    List<Appartement> findByProprietaireId(Long proprietaireId);

    @Query("SELECT a FROM Appartement a LEFT JOIN FETCH a.paiements WHERE a.id = :id")
    Optional<Appartement> findByIdWithPaiements(Long id);

    boolean existsByNumeroAndImmeubleId(String numero, Long immeubleId);
}
