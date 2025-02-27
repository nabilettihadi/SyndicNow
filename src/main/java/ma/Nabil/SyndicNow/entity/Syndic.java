package ma.Nabil.SyndicNow.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.*;
import lombok.experimental.SuperBuilder;
import ma.Nabil.SyndicNow.enums.Role;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "syndics")
public class Syndic extends User {

    @Column(unique = true, nullable = false)
    private String cin;

    private String numeroLicence;
    private String societe;
    private String siret;

    @Column(nullable = false)
    private LocalDateTime dateDebutActivite;

    @OneToMany(mappedBy = "syndic")
    @Builder.Default
    private Set<Immeuble> immeubles = new HashSet<>();

    public void prePersist() {
        this.setRole(Role.SYNDIC);
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
