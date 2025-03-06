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
public class MeetingResponse {
    private Long id;
    private String title;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Long immeubleId;
    private String immeubleName;
    private String location;
    private String description;
    private String agenda;
    private List<ParticipantInfo> participants;
    private boolean isOnline;
    private String meetingLink;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ParticipantInfo {
        private Long id;
        private String nom;
        private String prenom;
        private String email;
        private boolean hasConfirmed;
    }
} 