package ma.Nabil.SyndicNow.domain.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "meetings")
public class Meeting extends BaseEntity {

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private LocalDateTime dateTime;

    private String location;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MeetingType type;

    @Column(columnDefinition = "TEXT")
    private String agenda;

    @Column(columnDefinition = "TEXT")
    private String minutes;

    @Column(columnDefinition = "TEXT")
    private String decisions;

    private String attachmentUrls;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MeetingStatus status;

    @ManyToOne
    @JoinColumn(name = "organized_by_id", nullable = false)
    private User organizedBy;

    private Integer expectedParticipants;
    
    private Integer actualParticipants;

    @Column(columnDefinition = "TEXT")
    private String votingResults;

    public enum MeetingType {
        ASSEMBLEE_GENERALE,
        ASSEMBLEE_EXTRAORDINAIRE,
        CONSEIL_SYNDICAL,
        AUTRE
    }

    public enum MeetingStatus {
        PLANIFIEE,
        EN_COURS,
        TERMINEE,
        ANNULEE,
        REPORTEE
    }
}
