package ma.Nabil.SyndicNow.entity;

import jakarta.persistence.*;
import lombok.*;
import ma.Nabil.SyndicNow.enums.IncidentCategory;
import ma.Nabil.SyndicNow.enums.IncidentPriority;
import ma.Nabil.SyndicNow.enums.IncidentStatus;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
@Table(name = "incidents")
public class Incident {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(length = 1000)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private IncidentStatus status;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private IncidentPriority priority;

    @Column(nullable = false)
    private LocalDateTime reportedDate;

    @ManyToOne
    @JoinColumn(name = "reported_by_id", nullable = false)
    private User reportedBy;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private IncidentCategory category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_to_id")
    private Syndic assignedTo;

    private LocalDateTime resolutionDate;

    @Column(columnDefinition = "TEXT")
    private String resolution;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "appartement_id")
    private Appartement appartement;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "immeuble_id")
    private Immeuble immeuble;

    private String attachmentUrls;

    @CreatedBy
    private String createdBy;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedBy
    private String updatedBy;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}
