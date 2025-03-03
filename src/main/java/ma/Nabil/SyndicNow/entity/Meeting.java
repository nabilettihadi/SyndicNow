package ma.Nabil.SyndicNow.entity;

import jakarta.persistence.*;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@EqualsAndHashCode(callSuper = false)
@Table(name = "meetings")
public class Meeting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

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
