package ma.Nabil.SyndicNow.domain.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import ma.Nabil.SyndicNow.domain.enums.Role;

import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "proprietaires")
public class Proprietaire extends User {

    @Column(unique = true, nullable = false)
    private String cin;

    @OneToMany(mappedBy = "proprietaire", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<Appartement> appartements = new HashSet<>();

    @PrePersist
    public void prePersist() {
        this.setRole(Role.ROLE_PROPRIETAIRE);
    }

    public void addAppartement(Appartement appartement) {
        appartements.add(appartement);
        appartement.setProprietaire(this);
    }

    public void removeAppartement(Appartement appartement) {
        appartements.remove(appartement);
        appartement.setProprietaire(null);
    }
}
