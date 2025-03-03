package ma.Nabil.SyndicNow.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import ma.Nabil.SyndicNow.enums.Role;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
@Table(name = "proprietaires")
public class Proprietaire extends User {

    @Column(unique = true)
    private String cin;

    @OneToMany(mappedBy = "proprietaire", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Appartement> appartements = new ArrayList<>();

    @CreatedBy
    private String createdBy;

    @LastModifiedBy
    private String updatedBy;

    @PrePersist
    public void prePersist() {
        if (role == null) {
            role = Role.PROPRIETAIRE;
        }
    }

    public void addAppartement(Appartement appartement) {
        if (appartements == null) {
            appartements = new ArrayList<>();
        }
        appartements.add(appartement);
        appartement.setProprietaire(this);
    }

    public void removeAppartement(Appartement appartement) {
        if (appartements != null) {
            appartements.remove(appartement);
            appartement.setProprietaire(null);
        }
    }
}
