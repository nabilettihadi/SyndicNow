package ma.Nabil.SyndicNow.domain.entity;

import jakarta.persistence.*;
import lombok.*;
import ma.Nabil.SyndicNow.domain.enums.Role;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter
@Builder
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

    @OneToMany(mappedBy = "syndic", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Immeuble> immeubles = new HashSet<>();

    @PrePersist
    public void prePersist() {
        this.setRole(Role.ROLE_SYNDIC);
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
