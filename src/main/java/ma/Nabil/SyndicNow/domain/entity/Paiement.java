package ma.Nabil.SyndicNow.domain.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import ma.Nabil.SyndicNow.domain.enums.StatutPaiement;
import ma.Nabil.SyndicNow.domain.enums.TypePaiement;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "paiements")
public class Paiement extends BaseEntity {

    @Column(nullable = false)
    private String reference;

    @Column(nullable = false)
    private BigDecimal montant;

    @Column(nullable = false)
    private LocalDate datePaiement;

    private LocalDate dateEcheance;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TypePaiement type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatutPaiement statut;

    @Column(length = 1000)
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "appartement_id", nullable = false)
    private Appartement appartement;

    @PrePersist
    public void prePersist() {
        if (reference == null) {
            reference = generateReference();
        }
        if (statut == null) {
            statut = StatutPaiement.EN_ATTENTE;
        }
    }

    private String generateReference() {
        return "PAY-" + System.currentTimeMillis();
    }
}
