package ma.Nabil.SyndicNow.entity;

import jakarta.persistence.*;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@EqualsAndHashCode
@Table(name = "messages")
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "sender_id", nullable = false)
    private User sender;

    @Column(nullable = false)
    private String subject;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column(nullable = false)
    private LocalDateTime sentDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MessageStatus status;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MessagePriority priority;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MessageCategory category;

    private String attachmentUrls;

    @ManyToOne
    @JoinColumn(name = "parent_message_id")
    private Message parentMessage;

    @ManyToOne
    @JoinColumn(name = "appartement_id")
    private Appartement appartement;

    @ManyToOne
    @JoinColumn(name = "immeuble_id")
    private Immeuble immeuble;

    @Column(columnDefinition = "TEXT")
    private String recipients;

    private LocalDateTime readDate;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    @CreatedBy
    private String createdBy;

    @LastModifiedBy
    private String updatedBy;

    public enum MessageStatus {
        NON_LU,
        LU,
        ARCHIVE,
        SUPPRIME
    }

    public enum MessagePriority {
        BASSE,
        NORMALE,
        HAUTE,
        URGENTE
    }

    public enum MessageCategory {
        ANNONCE,
        NOTIFICATION,
        MESSAGE_PRIVE,
        ALERTE
    }
}
