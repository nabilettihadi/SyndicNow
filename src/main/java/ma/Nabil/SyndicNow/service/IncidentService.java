package ma.Nabil.SyndicNow.service;

import ma.Nabil.SyndicNow.dto.incident.IncidentRequest;
import ma.Nabil.SyndicNow.dto.incident.IncidentResponse;
import ma.Nabil.SyndicNow.entity.Incident.IncidentStatus;
import ma.Nabil.SyndicNow.entity.Incident.IncidentPriority;

import java.util.List;

public interface IncidentService {
    IncidentResponse createIncident(IncidentRequest request);
    IncidentResponse updateIncident(Long id, IncidentRequest request);
    void deleteIncident(Long id);
    IncidentResponse getIncidentById(Long id);
    List<IncidentResponse> getAllIncidents();
    List<IncidentResponse> getIncidentsByStatus(IncidentStatus status);
    List<IncidentResponse> getIncidentsByPriority(IncidentPriority priority);
    List<IncidentResponse> getIncidentsByImmeubleId(Long immeubleId);
    List<IncidentResponse> getIncidentsByAppartementId(Long appartementId);
    List<IncidentResponse> getIncidentsByReportedBy(Long userId);
    List<IncidentResponse> getIncidentsByAssignedTo(Long syndicId);
    IncidentResponse updateIncidentStatus(Long id, IncidentStatus status);
    IncidentResponse updateIncidentPriority(Long id, IncidentPriority priority);
    IncidentResponse assignIncident(Long id, Long syndicId);
    IncidentResponse resolveIncident(Long id, String resolution);
} 