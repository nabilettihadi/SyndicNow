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
@Table(name = "documents")
public class Document extends BaseEntity {

    @Column(nullable = false)
    private String title;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DocumentType type;

    @Column(nullable = false)
    private LocalDateTime uploadDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DocumentCategory category;

    @Column(nullable = false)
    private String filePath;

    private Long fileSize;

    @ManyToOne
    @JoinColumn(name = "uploaded_by_id", nullable = false)
    private User uploadedBy;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DocumentVisibility visibility;

    private LocalDateTime expiryDate;

    private String version;

    @Column(columnDefinition = "TEXT")
    private String description;

    @ManyToOne
    @JoinColumn(name = "appartement_id")
    private Appartement appartement;

    @ManyToOne
    @JoinColumn(name = "immeuble_id")
    private Immeuble immeuble;

    public enum DocumentType {
        CONTRAT,
        FACTURE,
        REGLEMENT,
        PV_REUNION,
        DEVIS,
        AUTRE
    }

    public enum DocumentCategory {
        ADMINISTRATIF,
        FINANCIER,
        TECHNIQUE,
        JURIDIQUE,
        AUTRE
    }

    public enum DocumentVisibility {
        PUBLIC,
        PRIVE,
        RESTREINT
    }
}
