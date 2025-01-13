package ma.Nabil.SyndicNow.repository;

import ma.Nabil.SyndicNow.model.entities.Cotisation;
import ma.Nabil.SyndicNow.model.entities.Facture;
import ma.Nabil.SyndicNow.model.enums.StatutFacture;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Repository
public interface FactureRepository extends JpaRepository<Facture, Long> {
    Optional<Facture> findByNumero(String numero);
    List<Facture> findByStatut(StatutFacture statut);
    List<Facture> findByCotisation(Cotisation cotisation);
    List<Facture> findByDateEmissionBetween(Date debut, Date fin);
    List<Facture> findByMontantGreaterThan(double montant);
}
