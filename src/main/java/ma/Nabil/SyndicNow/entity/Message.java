package ma.Nabil.SyndicNow.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "messages")
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String subject;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MessagePriority priority;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MessageCategory category;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MessageStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_id", nullable = false)
    private User sender;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_message_id")
    private Message parentMessage;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "appartement_id")
    private Appartement appartement;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "immeuble_id")
    private Immeuble immeuble;

    @Column(columnDefinition = "TEXT")
    private String attachmentUrls;

    @Column(columnDefinition = "TEXT")
    private String recipients;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private boolean read;
    private boolean archived;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        status = MessageStatus.SENT;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum MessagePriority {
        HIGH, MEDIUM, LOW
    }

    public enum MessageCategory {
        ANNOUNCEMENT, COMPLAINT, MAINTENANCE, PAYMENT, OTHER
    }

    public enum MessageStatus {
        DRAFT, SENT, DELIVERED, READ, ARCHIVED
    }
}
