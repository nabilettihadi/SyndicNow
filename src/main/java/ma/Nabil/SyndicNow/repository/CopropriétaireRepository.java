package ma.Nabil.SyndicNow.repository;

import ma.Nabil.SyndicNow.model.entities.Copropriétaire;
import ma.Nabil.SyndicNow.model.enums.TypeProprietaire;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CopropriétaireRepository extends JpaRepository<Copropriétaire, Long> {
    Optional<Copropriétaire> findByEmail(String email);
    List<Copropriétaire> findByTypeProprietaire(TypeProprietaire type);
    List<Copropriétaire> findByNomContainingOrPrenomContaining(String nom, String prenom);
    boolean existsByEmail(String email);
}
