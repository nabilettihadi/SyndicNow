package ma.Nabil.SyndicNow.repository;

import ma.Nabil.SyndicNow.model.entities.Appartement;
import ma.Nabil.SyndicNow.model.entities.Immeuble;
import ma.Nabil.SyndicNow.model.enums.TypeAppartement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AppartementRepository extends JpaRepository<Appartement, Long> {
    List<Appartement> findByImmeuble(Immeuble immeuble);
    List<Appartement> findByType(TypeAppartement type);
    List<Appartement> findByImmeubleAndType(Immeuble immeuble, TypeAppartement type);
    boolean existsByNumeroAndImmeuble(String numero, Immeuble immeuble);
}
