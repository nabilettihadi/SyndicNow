package ma.Nabil.SyndicNow.mapper;

import lombok.RequiredArgsConstructor;
import ma.Nabil.SyndicNow.dto.incident.IncidentRequest;
import ma.Nabil.SyndicNow.dto.incident.IncidentResponse;
import ma.Nabil.SyndicNow.entity.*;
import ma.Nabil.SyndicNow.enums.IncidentStatus;
import ma.Nabil.SyndicNow.exception.ResourceNotFoundException;
import ma.Nabil.SyndicNow.repository.AppartementRepository;
import ma.Nabil.SyndicNow.repository.ImmeubleRepository;
import ma.Nabil.SyndicNow.repository.SyndicRepository;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class IncidentMapper {

    private final SyndicRepository syndicRepository;
    private final AppartementRepository appartementRepository;
    private final ImmeubleRepository immeubleRepository;

    public IncidentResponse toResponse(Incident incident) {
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
                .appartementId(incident.getAppartement() != null ? incident.getAppartement().getId() : null)
                .appartementNumero(incident.getAppartement() != null ? incident.getAppartement().getNumero() : null)
                .immeubleId(incident.getImmeuble() != null ? incident.getImmeuble().getId() : null)
                .immeubleName(incident.getImmeuble() != null ? incident.getImmeuble().getNom() : null)
                .immeubleAdresse(incident.getImmeuble() != null ? incident.getImmeuble().getAdresse() : null)
                .immeubleVille(incident.getImmeuble() != null ? incident.getImmeuble().getVille() : null)
                .build();
    }

    public Incident toEntity(IncidentRequest request, User reportedBy) {
        Incident incident = Incident.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .status(IncidentStatus.NOUVEAU)
                .priority(request.getPriority())
                .reportedDate(LocalDateTime.now())
                .reportedBy(reportedBy)
                .category(request.getCategory())
                .build();

        setRelatedEntities(request, incident);
        return incident;
    }

    public void updateEntityFromRequest(IncidentRequest request, Incident incident) {
        incident.setTitle(request.getTitle());
        incident.setDescription(request.getDescription());
        incident.setPriority(request.getPriority());
        incident.setCategory(request.getCategory());

        setRelatedEntities(request, incident);
    }

    private void setRelatedEntities(IncidentRequest request, Incident incident) {
        if (request.getAssignedToId() != null) {
            Syndic syndic = syndicRepository.findById(request.getAssignedToId())
                    .orElseThrow(() -> new ResourceNotFoundException("Syndic non trouvé avec l'ID: " + request.getAssignedToId()));
            incident.setAssignedTo(syndic);
        }

        if (request.getAppartementId() != null) {
            Appartement appartement = appartementRepository.findById(request.getAppartementId())
                    .orElseThrow(() -> new ResourceNotFoundException("Appartement non trouvé avec l'ID: " + request.getAppartementId()));
            incident.setAppartement(appartement);
        }

        if (request.getImmeubleId() != null) {
            Immeuble immeuble = immeubleRepository.findById(request.getImmeubleId())
                    .orElseThrow(() -> new ResourceNotFoundException("Immeuble non trouvé avec l'ID: " + request.getImmeubleId()));
            incident.setImmeuble(immeuble);
        }
    }
} 