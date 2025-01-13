package ma.Nabil.SyndicNow.repository;

import ma.Nabil.SyndicNow.model.entities.Reclamation;
import ma.Nabil.SyndicNow.model.entities.Copropriétaire;
import ma.Nabil.SyndicNow.model.entities.Appartement;
import ma.Nabil.SyndicNow.model.enums.StatutReclamation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface ReclamationRepository extends JpaRepository<Reclamation, Long> {
    List<Reclamation> findByStatut(StatutReclamation statut);
    List<Reclamation> findByCopropriétaire(Copropriétaire copropriétaire);
    List<Reclamation> findByAppartement(Appartement appartement);
    List<Reclamation> findByDateCreationBetween(Date debut, Date fin);
    List<Reclamation> findByStatutAndDateCreationBefore(StatutReclamation statut, Date date);
}
