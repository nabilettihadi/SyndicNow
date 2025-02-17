package ma.Nabil.SyndicNow.domain.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "appartements")
public class Appartement extends BaseEntity {

    @Column(nullable = false)
    private String numero;

    private Integer etage;
    private Double surface;
    private Integer nombrePieces;
    private String type; // T1, T2, T3, etc.

    @Column(length = 1000)
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "immeuble_id")
    private Immeuble immeuble;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "proprietaire_id")
    private Proprietaire proprietaire;
}
