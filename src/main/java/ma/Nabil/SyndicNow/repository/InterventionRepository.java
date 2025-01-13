package ma.Nabil.SyndicNow.repository;

import ma.Nabil.SyndicNow.model.entities.Intervention;
import ma.Nabil.SyndicNow.model.entities.Equipement;
import ma.Nabil.SyndicNow.model.entities.Fournisseur;
import ma.Nabil.SyndicNow.model.enums.TypeIntervention;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface InterventionRepository extends JpaRepository<Intervention, Long> {
    List<Intervention> findByEquipement(Equipement equipement);
    List<Intervention> findByFournisseur(Fournisseur fournisseur);
    List<Intervention> findByType(TypeIntervention type);
    List<Intervention> findByDateInterventionBetween(Date debut, Date fin);
    List<Intervention> findByUrgenteTrueAndDateFinIsNull();
}
