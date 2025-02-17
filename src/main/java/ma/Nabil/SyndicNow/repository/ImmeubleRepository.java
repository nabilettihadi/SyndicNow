package ma.Nabil.SyndicNow.repository;

import ma.Nabil.SyndicNow.domain.entity.Immeuble;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ImmeubleRepository extends BaseRepository<Immeuble, Long> {
    List<Immeuble> findBySyndicId(Long syndicId);
    
    @Query("SELECT i FROM Immeuble i LEFT JOIN FETCH i.appartements WHERE i.id = :id")
    Optional<Immeuble> findByIdWithAppartements(Long id);
    
    boolean existsByNomAndSyndicId(String nom, Long syndicId);
}
