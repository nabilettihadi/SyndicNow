package ma.Nabil.SyndicNow.domain.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "immeubles")
public class Immeuble extends BaseEntity {

    @Column(nullable = false)
    private String nom;

    @Column(nullable = false)
    private String adresse;

    private String ville;
    private String codePostal;
    private String pays;

    private Integer nombreEtages;
    private Integer nombreAppartements;
    private Double surface;

    @Column(length = 1000)
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "syndic_id")
    private Syndic syndic;

    @OneToMany(mappedBy = "immeuble", cascade = CascadeType.ALL)
    @Builder.Default
    private Set<Appartement> appartements = new HashSet<>();

    public void addAppartement(Appartement appartement) {
        appartements.add(appartement);
        appartement.setImmeuble(this);
    }

    public void removeAppartement(Appartement appartement) {
        appartements.remove(appartement);
        appartement.setImmeuble(null);
    }
}
