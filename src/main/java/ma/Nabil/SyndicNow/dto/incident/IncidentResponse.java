package ma.Nabil.SyndicNow.dto.incident;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import ma.Nabil.SyndicNow.enums.IncidentCategory;
import ma.Nabil.SyndicNow.enums.IncidentPriority;
import ma.Nabil.SyndicNow.enums.IncidentStatus;

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
    private LocalDateTime reportedDate;
    private IncidentCategory category;
    private String resolution;
    private LocalDateTime resolutionDate;
    private String attachmentUrls;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Informations liées
    private Long reportedById;
    private String reportedByName;
    private Long assignedToId;
    private String assignedToName;
    private Long appartementId;
    private String appartementNumero;
    private Long immeubleId;
    private String immeubleName;
} 