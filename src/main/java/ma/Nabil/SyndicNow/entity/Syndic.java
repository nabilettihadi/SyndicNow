package ma.Nabil.SyndicNow.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
@Table(name = "syndics")
public class Syndic {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String cin;
    private String numeroLicence;
    private String societe;
    private String siret;

    @Column(nullable = false)
    private LocalDateTime dateDebutActivite;

    @OneToMany(mappedBy = "syndic", cascade = CascadeType.ALL)
    private List<Immeuble> immeubles = new ArrayList<>();

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    @CreatedBy
    private String createdBy;

    @LastModifiedBy
    private String updatedBy;

    public void prePersist() {
        if (dateDebutActivite == null) {
            dateDebutActivite = LocalDateTime.now();
        }
    }

    public void addImmeuble(Immeuble immeuble) {
        immeubles.add(immeuble);
        immeuble.setSyndic(this);
    }

    public void removeImmeuble(Immeuble immeuble) {
        immeubles.remove(immeuble);
        immeuble.setSyndic(null);
    }
}
