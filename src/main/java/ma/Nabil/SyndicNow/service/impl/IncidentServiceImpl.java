package ma.Nabil.SyndicNow.service.impl;

import lombok.RequiredArgsConstructor;
import ma.Nabil.SyndicNow.dto.incident.IncidentRequest;
import ma.Nabil.SyndicNow.dto.incident.IncidentResponse;
import ma.Nabil.SyndicNow.entity.Appartement;
import ma.Nabil.SyndicNow.entity.Immeuble;
import ma.Nabil.SyndicNow.entity.Incident;
import ma.Nabil.SyndicNow.entity.Incident.IncidentStatus;
import ma.Nabil.SyndicNow.entity.Incident.IncidentPriority;
import ma.Nabil.SyndicNow.entity.Syndic;
import ma.Nabil.SyndicNow.entity.User;
import ma.Nabil.SyndicNow.exception.InvalidOperationException;
import ma.Nabil.SyndicNow.exception.ResourceNotFoundException;
import ma.Nabil.SyndicNow.repository.*;
import ma.Nabil.SyndicNow.service.IncidentService;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class IncidentServiceImpl implements IncidentService {

    private final IncidentRepository incidentRepository;
    private final UserRepository userRepository;
    private final SyndicRepository syndicRepository;
    private final ImmeubleRepository immeubleRepository;
    private final AppartementRepository appartementRepository;

    @Override
    @Transactional
    public IncidentResponse createIncident(IncidentRequest request) {
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        Incident incident = Incident.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .status(IncidentStatus.NOUVEAU)
                .priority(request.getPriority())
                .reportedDate(LocalDateTime.now())
                .reportedBy(currentUser)
                .category(request.getCategory())
                .attachmentUrls(request.getAttachmentUrls())
                .build();

        if (request.getAssignedToId() != null) {
            Syndic syndic = syndicRepository.findById(request.getAssignedToId())
                    .orElseThrow(() -> new ResourceNotFoundException("Syndic non trouvé"));
            incident.setAssignedTo(syndic);
        }

        if (request.getAppartementId() != null) {
            Appartement appartement = appartementRepository.findById(request.getAppartementId())
                    .orElseThrow(() -> new ResourceNotFoundException("Appartement non trouvé"));
            incident.setAppartement(appartement);
        }

        if (request.getImmeubleId() != null) {
            Immeuble immeuble = immeubleRepository.findById(request.getImmeubleId())
                    .orElseThrow(() -> new ResourceNotFoundException("Immeuble non trouvé"));
            incident.setImmeuble(immeuble);
        }

        incident = incidentRepository.save(incident);
        return mapToResponse(incident);
    }

    @Override
    @Transactional
    public IncidentResponse updateIncident(Long id, IncidentRequest request) {
        Incident incident = incidentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Incident non trouvé"));

        if (incident.getStatus() == IncidentStatus.RESOLU || incident.getStatus() == IncidentStatus.FERME) {
            throw new InvalidOperationException("Impossible de modifier un incident résolu ou fermé");
        }

        incident.setTitle(request.getTitle());
        incident.setDescription(request.getDescription());
        incident.setPriority(request.getPriority());
        incident.setCategory(request.getCategory());
        incident.setAttachmentUrls(request.getAttachmentUrls());

        if (request.getAssignedToId() != null) {
            Syndic syndic = syndicRepository.findById(request.getAssignedToId())
                    .orElseThrow(() -> new ResourceNotFoundException("Syndic non trouvé"));
            incident.setAssignedTo(syndic);
        }

        if (request.getAppartementId() != null) {
            Appartement appartement = appartementRepository.findById(request.getAppartementId())
                    .orElseThrow(() -> new ResourceNotFoundException("Appartement non trouvé"));
            incident.setAppartement(appartement);
        }

        if (request.getImmeubleId() != null) {
            Immeuble immeuble = immeubleRepository.findById(request.getImmeubleId())
                    .orElseThrow(() -> new ResourceNotFoundException("Immeuble non trouvé"));
            incident.setImmeuble(immeuble);
        }

        incident = incidentRepository.save(incident);
        return mapToResponse(incident);
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
        return mapToResponse(incident);
    }

    @Override
    @Transactional(readOnly = true)
    public List<IncidentResponse> getAllIncidents() {
        return incidentRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<IncidentResponse> getIncidentsByStatus(IncidentStatus status) {
        return incidentRepository.findByStatus(status).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<IncidentResponse> getIncidentsByPriority(IncidentPriority priority) {
        return incidentRepository.findByPriority(priority).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<IncidentResponse> getIncidentsByImmeubleId(Long immeubleId) {
        return incidentRepository.findByImmeubleId(immeubleId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<IncidentResponse> getIncidentsByAppartementId(Long appartementId) {
        return incidentRepository.findByAppartementId(appartementId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<IncidentResponse> getIncidentsByReportedBy(Long userId) {
        return incidentRepository.findByReportedById(userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<IncidentResponse> getIncidentsByAssignedTo(Long syndicId) {
        return incidentRepository.findByAssignedToId(syndicId).stream()
                .map(this::mapToResponse)
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
        return mapToResponse(incident);
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
        return mapToResponse(incident);
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
        return mapToResponse(incident);
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
        return mapToResponse(incident);
    }

    private IncidentResponse mapToResponse(Incident incident) {
        return IncidentResponse.builder()
                .id(incident.getId())
                .title(incident.getTitle())
                .description(incident.getDescription())
                .status(incident.getStatus())
                .priority(incident.getPriority())
                .category(incident.getCategory())
                .reportedDate(incident.getReportedDate())
                .reportedById(incident.getReportedBy().getId())
                .reportedByName(incident.getReportedBy().getNom() + " " + incident.getReportedBy().getPrenom())
                .assignedToId(incident.getAssignedTo() != null ? incident.getAssignedTo().getId() : null)
                .assignedToName(incident.getAssignedTo() != null ? incident.getAssignedTo().getNom() + " " + incident.getAssignedTo().getPrenom() : null)
                .resolutionDate(incident.getResolutionDate())
                .resolution(incident.getResolution())
                .appartementId(incident.getAppartement() != null ? incident.getAppartement().getId() : null)
                .appartementNumero(incident.getAppartement() != null ? incident.getAppartement().getNumero() : null)
                .immeubleId(incident.getImmeuble() != null ? incident.getImmeuble().getId() : null)
                .immeubleName(incident.getImmeuble() != null ? incident.getImmeuble().getNom() : null)
                .attachmentUrls(incident.getAttachmentUrls())
                .createdAt(incident.getCreatedAt())
                .updatedAt(incident.getUpdatedAt())
                .createdBy(incident.getCreatedBy())
                .updatedBy(incident.getUpdatedBy())
                .build();
    }
} 