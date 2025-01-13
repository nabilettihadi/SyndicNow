package ma.Nabil.SyndicNow.repository;

import ma.Nabil.SyndicNow.model.entities.Document;
import ma.Nabil.SyndicNow.model.entities.Immeuble;
import ma.Nabil.SyndicNow.model.enums.TypeDocument;
import ma.Nabil.SyndicNow.model.enums.StatutDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {
    Optional<Document> findByReference(String reference);
    List<Document> findByType(TypeDocument type);
    List<Document> findByStatut(StatutDocument statut);
    List<Document> findByImmeuble(Immeuble immeuble);
    List<Document> findByDateCreationBetween(Date debut, Date fin);
    List<Document> findByTitreContainingIgnoreCase(String titre);
    List<Document> findByTypeAndStatut(TypeDocument type, StatutDocument statut);
    List<Document> findByMontantGreaterThan(double montant);
}
