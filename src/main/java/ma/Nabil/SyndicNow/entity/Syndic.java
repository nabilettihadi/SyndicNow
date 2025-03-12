package ma.Nabil.SyndicNow.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import lombok.Builder;
import ma.Nabil.SyndicNow.enums.Role;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "syndics")
@DiscriminatorValue("SYNDIC")
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
public class Syndic extends User {

    @Column(nullable = false)
    private String siret;

    private String societe;

    private String numeroLicence;

    private LocalDateTime dateDebutActivite;

    @OneToMany(mappedBy = "syndic", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private Set<Immeuble> immeubles = new HashSet<>();

    @PrePersist
    public void onCreateSyndic() {
        if (getRole() == null) {
            setRole(Role.SYNDIC);
        }
    }

    public String getCin() {
        return cin;
    }

    public void setCin(String cin) {
        this.cin = cin;
    }
}
