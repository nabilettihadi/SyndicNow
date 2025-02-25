package ma.Nabil.SyndicNow.domain.entity;

import jakarta.persistence.*;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import ma.Nabil.SyndicNow.domain.enums.DocumentCategory;
import ma.Nabil.SyndicNow.domain.enums.DocumentType;
import ma.Nabil.SyndicNow.domain.enums.DocumentVisibility;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
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
    private Syndic uploadedBy;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DocumentVisibility visibility;

    private LocalDateTime expiryDate;

    @Column(name = "doc_version")
    private String documentVersion;

    @Column(columnDefinition = "TEXT")
    private String description;

    @ManyToOne
    @JoinColumn(name = "immeuble_id")
    private Immeuble immeuble;
}
