package ma.Nabil.SyndicNow.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import ma.Nabil.SyndicNow.enums.Role;
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
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
@Table(name = "syndics")
@DiscriminatorValue("SYNDIC")
public class Syndic extends User {

    @Column(unique = true)
    private String cin;

    @Column(unique = true)
    private String numeroLicence;

    private String societe;

    @Column(unique = true)
    private String siret;

    @Column(nullable = false)
    private LocalDateTime dateDebutActivite;

    @OneToMany(mappedBy = "syndic", cascade = CascadeType.ALL)
    @Builder.Default
    private List<Immeuble> immeubles = new ArrayList<>();

    @CreatedBy
    private String createdBy;

    @LastModifiedBy
    private String updatedBy;

    @PrePersist
    public void prePersist() {
        if (dateDebutActivite == null) {
            dateDebutActivite = LocalDateTime.now();
        }
        if (role == null) {
            role = Role.SYNDIC;
        }
    }

    public void addImmeuble(Immeuble immeuble) {
        if (immeubles == null) {
            immeubles = new ArrayList<>();
        }
        immeubles.add(immeuble);
        immeuble.setSyndic(this);
    }

    public void removeImmeuble(Immeuble immeuble) {
        if (immeubles != null) {
            immeubles.remove(immeuble);
            immeuble.setSyndic(null);
        }
    }
}
