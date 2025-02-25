package ma.Nabil.SyndicNow.domain.entity;

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
@EqualsAndHashCode(callSuper = true)
@Table(name = "incidents")
public class Incident extends BaseEntity {

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @ManyToOne
    @JoinColumn(name = "reported_by_id", nullable = false)
    private User reportedBy;

    @Column(nullable = false)
    private LocalDateTime reportedDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private IncidentStatus status;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private IncidentPriority priority;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private IncidentCategory category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_to_id")
    private Syndic assignedTo;

    private LocalDateTime resolutionDate;

    @Column(columnDefinition = "TEXT")
    private String resolution;

    @ManyToOne
    @JoinColumn(name = "appartement_id")
    private Appartement appartement;

    @ManyToOne
    @JoinColumn(name = "immeuble_id")
    private Immeuble immeuble;

    private String attachmentUrls;

    public enum IncidentStatus {
        NOUVEAU,
        EN_COURS,
        RESOLU,
        FERME
    }

    public enum IncidentPriority {
        BASSE,
        MOYENNE,
        HAUTE,
        URGENTE
    }

    public enum IncidentCategory {
        PLOMBERIE,
        ELECTRICITE,
        ASCENSEUR,
        NETTOYAGE,
        SECURITE,
        CHAUFFAGE,
        AUTRE
    }
}
