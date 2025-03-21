package ma.Nabil.SyndicNow.repository;

import ma.Nabil.SyndicNow.entity.Incident;
import ma.Nabil.SyndicNow.enums.IncidentPriority;
import ma.Nabil.SyndicNow.enums.IncidentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IncidentRepository extends JpaRepository<Incident, Long> {
    List<Incident> findByStatus(IncidentStatus status);

    List<Incident> findByPriority(IncidentPriority priority);

    List<Incident> findByImmeubleId(Long immeubleId);

    List<Incident> findByAppartementId(Long appartementId);

    List<Incident> findByReportedById(Long userId);

    List<Incident> findByAssignedToId(Long syndicId);
} 