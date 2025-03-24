package ma.Nabil.SyndicNow.service.impl;

import lombok.RequiredArgsConstructor;
import ma.Nabil.SyndicNow.dto.incident.IncidentRequest;
import ma.Nabil.SyndicNow.dto.incident.IncidentResponse;
import ma.Nabil.SyndicNow.entity.Incident;
import ma.Nabil.SyndicNow.entity.Syndic;
import ma.Nabil.SyndicNow.entity.User;
import ma.Nabil.SyndicNow.enums.IncidentPriority;
import ma.Nabil.SyndicNow.enums.IncidentStatus;
import ma.Nabil.SyndicNow.exception.InvalidOperationException;
import ma.Nabil.SyndicNow.exception.ResourceNotFoundException;
import ma.Nabil.SyndicNow.mapper.IncidentMapper;
import ma.Nabil.SyndicNow.repository.IncidentRepository;
import ma.Nabil.SyndicNow.repository.SyndicRepository;
import ma.Nabil.SyndicNow.repository.UserRepository;
import ma.Nabil.SyndicNow.security.CustomUserDetails;
import ma.Nabil.SyndicNow.service.IncidentService;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class IncidentServiceImpl implements IncidentService {

    private final IncidentRepository incidentRepository;
    private final SyndicRepository syndicRepository;
    private final UserRepository userRepository;
    private final IncidentMapper incidentMapper;

    @Override
    @Transactional
    public IncidentResponse createIncident(IncidentRequest request) {
        CustomUserDetails currentUserDetails = (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        User currentUser = userRepository.findById(currentUserDetails.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé"));

        Incident incident = incidentMapper.toEntity(request, currentUser);
        incident = incidentRepository.save(incident);

        return incidentMapper.toResponse(incident);
    }

    @Override
    @Transactional
    public IncidentResponse updateIncident(Long id, IncidentRequest request) {
        Incident incident = incidentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Incident non trouvé"));

        if (incident.getStatus() == IncidentStatus.RESOLU || incident.getStatus() == IncidentStatus.FERME) {
            throw new InvalidOperationException("Impossible de modifier un incident résolu ou fermé");
        }

        incidentMapper.updateEntityFromRequest(request, incident);
        incident = incidentRepository.save(incident);

        return incidentMapper.toResponse(incident);
    }

    @Override
    @Transactional
    public void deleteIncident(Long id) {
        Incident incident = incidentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Incident non trouvé"));

        if (incident.getStatus() == IncidentStatus.RESOLU || incident.getStatus() == IncidentStatus.FERME) {
            throw new InvalidOperationException("Impossible de supprimer un incident résolu ou fermé");
        }

        incidentRepository.delete(incident);
    }

    @Override
    @Transactional(readOnly = true)
    public IncidentResponse getIncidentById(Long id) {
        Incident incident = incidentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Incident non trouvé"));
        return incidentMapper.toResponse(incident);
    }

    @Override
    @Transactional(readOnly = true)
    public List<IncidentResponse> getAllIncidents() {
        return incidentRepository.findAll().stream()
                .map(incidentMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<IncidentResponse> getIncidentsByStatus(IncidentStatus status) {
        return incidentRepository.findByStatus(status).stream()
                .map(incidentMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<IncidentResponse> getIncidentsByPriority(IncidentPriority priority) {
        return incidentRepository.findByPriority(priority).stream()
                .map(incidentMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<IncidentResponse> getIncidentsByImmeubleId(Long immeubleId) {
        return incidentRepository.findByImmeubleId(immeubleId).stream()
                .map(incidentMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<IncidentResponse> getIncidentsByAppartementId(Long appartementId) {
        return incidentRepository.findByAppartementId(appartementId).stream()
                .map(incidentMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<IncidentResponse> getIncidentsByReportedBy(Long userId) {
        return incidentRepository.findByReportedById(userId).stream()
                .map(incidentMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<IncidentResponse> getIncidentsByAssignedTo(Long syndicId) {
        return incidentRepository.findByAssignedToId(syndicId).stream()
                .map(incidentMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public IncidentResponse updateIncidentStatus(Long id, IncidentStatus status) {
        Incident incident = incidentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Incident non trouvé"));

        if (incident.getStatus() == IncidentStatus.FERME) {
            throw new InvalidOperationException("Impossible de modifier le statut d'un incident fermé");
        }

        incident.setStatus(status);
        if (status == IncidentStatus.RESOLU) {
            incident.setResolutionDate(LocalDateTime.now());
        }

        incident = incidentRepository.save(incident);
        return incidentMapper.toResponse(incident);
    }

    @Override
    @Transactional
    public IncidentResponse updateIncidentPriority(Long id, IncidentPriority priority) {
        Incident incident = incidentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Incident non trouvé"));

        if (incident.getStatus() == IncidentStatus.RESOLU || incident.getStatus() == IncidentStatus.FERME) {
            throw new InvalidOperationException("Impossible de modifier la priorité d'un incident résolu ou fermé");
        }

        incident.setPriority(priority);
        incident = incidentRepository.save(incident);
        return incidentMapper.toResponse(incident);
    }

    @Override
    @Transactional
    public IncidentResponse assignIncident(Long id, Long syndicId) {
        Incident incident = incidentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Incident non trouvé"));

        if (incident.getStatus() == IncidentStatus.RESOLU || incident.getStatus() == IncidentStatus.FERME) {
            throw new InvalidOperationException("Impossible d'assigner un incident résolu ou fermé");
        }

        Syndic syndic = syndicRepository.findById(syndicId)
                .orElseThrow(() -> new ResourceNotFoundException("Syndic non trouvé"));

        incident.setAssignedTo(syndic);
        incident.setStatus(IncidentStatus.EN_COURS);
        incident = incidentRepository.save(incident);
        return incidentMapper.toResponse(incident);
    }

    @Override
    @Transactional
    public IncidentResponse resolveIncident(Long id, String resolution) {
        Incident incident = incidentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Incident non trouvé"));

        if (incident.getStatus() == IncidentStatus.RESOLU || incident.getStatus() == IncidentStatus.FERME) {
            throw new InvalidOperationException("L'incident est déjà résolu ou fermé");
        }

        incident.setResolution(resolution);
        incident.setStatus(IncidentStatus.RESOLU);
        incident.setResolutionDate(LocalDateTime.now());
        incident = incidentRepository.save(incident);
        return incidentMapper.toResponse(incident);
    }
} 