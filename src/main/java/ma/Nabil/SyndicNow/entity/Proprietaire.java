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

import java.util.HashSet;
import java.util.Set;

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

    @ManyToMany(mappedBy = "proprietaires")
    @Builder.Default
    private Set<Appartement> appartements = new HashSet<>();

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
            appartements = new HashSet<>();
        }
        appartements.add(appartement);
        appartement.getProprietaires().add(this);
    }

    public void removeAppartement(Appartement appartement) {
        if (appartements != null) {
            appartements.remove(appartement);
            appartement.getProprietaires().remove(this);
        }
    }
}
