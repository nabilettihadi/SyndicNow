package ma.Nabil.SyndicNow.repository;

import ma.Nabil.SyndicNow.model.entities.Document;
import ma.Nabil.SyndicNow.model.entities.Immeuble;
import ma.Nabil.SyndicNow.model.enums.TypeDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {
    List<Document> findByType(TypeDocument type);
    List<Document> findByImmeuble(Immeuble immeuble);
    List<Document> findByDateCreationBetween(Date debut, Date fin);
    List<Document> findByTitreContainingIgnoreCase(String titre);
    List<Document> findByImmeubleAndType(Immeuble immeuble, TypeDocument type);
}
