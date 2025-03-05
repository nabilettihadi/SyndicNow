package ma.Nabil.SyndicNow.dto.incident;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import ma.Nabil.SyndicNow.entity.Incident.IncidentCategory;
import ma.Nabil.SyndicNow.entity.Incident.IncidentPriority;
import ma.Nabil.SyndicNow.entity.Incident.IncidentStatus;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IncidentResponse {
    private Long id;
    private String title;
    private String description;
    private IncidentStatus status;
    private IncidentPriority priority;
    private IncidentCategory category;
    private LocalDateTime reportedDate;
    private Long reportedById;
    private String reportedByName;
    private Long assignedToId;
    private String assignedToName;
    private LocalDateTime resolutionDate;
    private String resolution;
    private Long appartementId;
    private String appartementNumero;
    private Long immeubleId;
    private String immeubleName;
    private String attachmentUrls;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String createdBy;
    private String updatedBy;
} 