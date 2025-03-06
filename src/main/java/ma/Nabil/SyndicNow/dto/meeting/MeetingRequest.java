package ma.Nabil.SyndicNow.dto.meeting;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
public class MeetingRequest {
    @NotBlank(message = "Le titre est obligatoire")
    private String title;

    @NotNull(message = "La date de début est obligatoire")
    @Future(message = "La date de début doit être dans le futur")
    private LocalDateTime startTime;

    @NotNull(message = "La date de fin est obligatoire")
    @Future(message = "La date de fin doit être dans le futur")
    private LocalDateTime endTime;

    @NotNull(message = "L'ID de l'immeuble est obligatoire")
    private Long immeubleId;

    private String location;

    private String description;

    private String agenda;

    private List<Long> participantIds;

    private boolean isOnline;

    private String meetingLink;
} 