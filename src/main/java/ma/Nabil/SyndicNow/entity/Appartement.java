package ma.Nabil.SyndicNow.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "appartements")
public class Appartement extends BaseEntity {

    @Column(nullable = false)
    private String numero;

    private Integer etage;
    private Double surface;
    private Integer nombrePieces;
    private String type;

    @Column(length = 1000)
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "immeuble_id")
    private Immeuble immeuble;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "proprietaire_id")
    private Proprietaire proprietaire;

    @OneToMany(mappedBy = "appartement", cascade = CascadeType.ALL)
    @Builder.Default
    private List<Paiement> paiements = new ArrayList<>();
}
