package ma.Nabil.SyndicNow.dto.incident;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import ma.Nabil.SyndicNow.entity.Incident.IncidentCategory;
import ma.Nabil.SyndicNow.entity.Incident.IncidentPriority;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IncidentRequest {
    @NotBlank(message = "Le titre est obligatoire")
    private String title;

    @NotBlank(message = "La description est obligatoire")
    private String description;

    @NotNull(message = "La priorité est obligatoire")
    private IncidentPriority priority;

    @NotNull(message = "La catégorie est obligatoire")
    private IncidentCategory category;

    private Long assignedToId;
    private Long appartementId;
    private Long immeubleId;
    private String attachmentUrls;
} 