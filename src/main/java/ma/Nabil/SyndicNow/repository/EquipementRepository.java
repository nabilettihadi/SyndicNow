package ma.Nabil.SyndicNow.repository;

import ma.Nabil.SyndicNow.model.entities.Equipement;
import ma.Nabil.SyndicNow.model.entities.Immeuble;
import ma.Nabil.SyndicNow.model.enums.TypeEquipement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface EquipementRepository extends JpaRepository<Equipement, Long> {
    List<Equipement> findByImmeuble(Immeuble immeuble);
    List<Equipement> findByType(TypeEquipement type);
    List<Equipement> findByDateProchainEntretienBefore(Date date);
    List<Equipement> findByImmeubleAndType(Immeuble immeuble, TypeEquipement type);
    List<Equipement> findByFournisseurMaintenanceId(Long fournisseurId);
}
