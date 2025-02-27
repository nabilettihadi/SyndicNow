package ma.Nabil.SyndicNow.dto.incident;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IncidentCreateDTO {
    private String title;
    private String description;
    private String priority;
    private LocalDateTime incidentDate;
    private Long appartementId;
    private Long immeubleId;
    private String attachmentUrls;
}
