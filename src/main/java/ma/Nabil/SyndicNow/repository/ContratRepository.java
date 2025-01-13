package ma.Nabil.SyndicNow.repository;

import ma.Nabil.SyndicNow.model.entities.Contrat;
import ma.Nabil.SyndicNow.model.entities.Fournisseur;
import ma.Nabil.SyndicNow.model.entities.Immeuble;
import ma.Nabil.SyndicNow.model.enums.TypeContrat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Repository
public interface ContratRepository extends JpaRepository<Contrat, Long> {
    Optional<Contrat> findByReference(String reference);
    List<Contrat> findByImmeuble(Immeuble immeuble);
    List<Contrat> findByFournisseur(Fournisseur fournisseur);
    List<Contrat> findByType(TypeContrat type);
    List<Contrat> findByDateFinBefore(Date date);
    List<Contrat> findByActifTrue();
}
