package ma.Nabil.SyndicNow.repository;

import ma.Nabil.SyndicNow.model.entities.Appartement;
import ma.Nabil.SyndicNow.model.entities.Incident;
import ma.Nabil.SyndicNow.model.enums.StatutIncident;
import ma.Nabil.SyndicNow.model.enums.PrioriteIncident;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface IncidentRepository extends JpaRepository<Incident, Long> {
    List<Incident> findByStatus(StatutIncident status);
    List<Incident> findByPriorite(PrioriteIncident priorite);
    List<Incident> findByAppartement(Appartement appartement);
    List<Incident> findByDateSignalementBetween(Date debut, Date fin);
    List<Incident> findByStatusAndPriorite(StatutIncident status, PrioriteIncident priorite);
}
