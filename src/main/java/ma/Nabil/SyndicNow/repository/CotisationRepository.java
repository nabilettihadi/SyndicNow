package ma.Nabil.SyndicNow.repository;

import ma.Nabil.SyndicNow.model.entities.Appartement;
import ma.Nabil.SyndicNow.model.entities.Copropriétaire;
import ma.Nabil.SyndicNow.model.entities.Cotisation;
import ma.Nabil.SyndicNow.model.enums.StatutCotisation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface CotisationRepository extends JpaRepository<Cotisation, Long> {
    List<Cotisation> findByCopropriétaire(Copropriétaire copropriétaire);
    List<Cotisation> findByAppartement(Appartement appartement);
    List<Cotisation> findByStatut(StatutCotisation statut);
    List<Cotisation> findByDateEcheanceBefore(Date date);
    List<Cotisation> findByPeriode(String periode);
}
