package ma.Nabil.SyndicNow.dto.meeting;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MeetingUpdateDTO {
    private Long id;
    private String titre;
    private String description;
    private LocalDateTime dateReunion;
    private String lieu;
    private String status;
    private List<Long> participantIds;
}
