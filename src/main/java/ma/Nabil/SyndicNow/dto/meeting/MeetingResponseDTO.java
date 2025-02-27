package ma.Nabil.SyndicNow.dto.meeting;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import ma.Nabil.SyndicNow.dto.proprietaire.ProprietaireResponseDTO;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MeetingResponseDTO {
    private Long id;
    private String titre;
    private String description;
    private LocalDateTime dateReunion;
    private String lieu;
    private String status;
    private Long immeubleId;
    private List<ProprietaireResponseDTO> participants;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String createdBy;
}
