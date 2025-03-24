package ma.Nabil.SyndicNow.entity;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import ma.Nabil.SyndicNow.enums.PreferenceCommunication;
import ma.Nabil.SyndicNow.enums.Role;
import ma.Nabil.SyndicNow.enums.TypeProprietaire;
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

    @OneToMany(mappedBy = "proprietaire", cascade = CascadeType.ALL)
    @Builder.Default
    private List<Appartement> appartements = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    @Column(name = "preferences_communication")
    private PreferenceCommunication preferencesCommunication;

    @Enumerated(EnumType.STRING)
    @Column(name = "type_proprietaire")
    private TypeProprietaire typeProprietaire;

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
