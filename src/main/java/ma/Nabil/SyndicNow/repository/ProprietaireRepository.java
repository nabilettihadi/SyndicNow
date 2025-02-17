package ma.Nabil.SyndicNow.repository;

import ma.Nabil.SyndicNow.domain.entity.Proprietaire;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProprietaireRepository extends BaseRepository<Proprietaire, Long> {
    Optional<Proprietaire> findByEmail(String email);
    boolean existsByEmail(String email);
    
    @Query("SELECT DISTINCT p FROM Proprietaire p LEFT JOIN FETCH p.appartements WHERE p.id IN " +
           "(SELECT DISTINCT a.proprietaire.id FROM Appartement a WHERE a.immeuble.syndic.id = :syndicId)")
    List<Proprietaire> findAllBySyndicId(Long syndicId);
    
    @Query("SELECT p FROM Proprietaire p LEFT JOIN FETCH p.appartements WHERE p.id = :id")
    Optional<Proprietaire> findByIdWithAppartements(Long id);
}
