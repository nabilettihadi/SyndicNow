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
@Table(name = "messages")
public class Message extends BaseEntity {

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
    private String recipients; // Stocké comme JSON des IDs des utilisateurs

    private LocalDateTime readDate;

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
