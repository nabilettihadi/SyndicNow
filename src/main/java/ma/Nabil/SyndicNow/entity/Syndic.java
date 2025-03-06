package ma.Nabil.SyndicNow.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

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
@AllArgsConstructor
public class Syndic extends User {

    private String entreprise;

    private String cin;

    private String numeroLicence;

    private String siret;

    private String societe;

    private LocalDateTime dateDebutActivite;

    @OneToMany(mappedBy = "syndic", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<Immeuble> immeubles = new HashSet<>();

    public String getCin() {
        return cin;
    }

    public void setCin(String cin) {
        this.cin = cin;
    }
}
