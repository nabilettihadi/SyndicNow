package ma.Nabil.SyndicNow.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import lombok.Builder;
import ma.Nabil.SyndicNow.enums.Role;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "proprietaires")
@DiscriminatorValue("PROPRIETAIRE")
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Proprietaire extends User {

    @Column(unique = true)
    private String cin;

    @OneToMany(mappedBy = "proprietaire", cascade = CascadeType.ALL)
    @Builder.Default
    private List<Appartement> appartements = new ArrayList<>();

    @CreatedBy
    private String createdBy;

    @LastModifiedBy
    private String updatedBy;

    @PrePersist
    public void onCreateProprietaire() {
        if (getRole() == null) {
            setRole(Role.PROPRIETAIRE);
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
