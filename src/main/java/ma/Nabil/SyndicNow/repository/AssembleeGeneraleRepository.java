package ma.Nabil.SyndicNow.repository;

import ma.Nabil.SyndicNow.model.entities.AssembleeGenerale;
import ma.Nabil.SyndicNow.model.entities.Immeuble;
import ma.Nabil.SyndicNow.model.enums.TypeAssemblee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface AssembleeGeneraleRepository extends JpaRepository<AssembleeGenerale, Long> {
    List<AssembleeGenerale> findByImmeuble(Immeuble immeuble);
    List<AssembleeGenerale> findByType(TypeAssemblee type);
    List<AssembleeGenerale> findByDateBetween(Date debut, Date fin);
    List<AssembleeGenerale> findByImmeubleAndType(Immeuble immeuble, TypeAssemblee type);
    List<AssembleeGenerale> findBySujetContainingIgnoreCase(String sujet);
}
