package ma.Nabil.SyndicNow.model.entities;

import ma.Nabil.SyndicNow.model.enums.StatutCotisation;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Cotisation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private double montant;
    
    @Temporal(TemporalType.DATE)
    private Date dateEcheance;
    
    @Temporal(TemporalType.DATE)
    private Date datePaiement;
    
    @Enumerated(EnumType.STRING)
    private StatutCotisation statut;
    
    private String periode;
    private double penalites;
    
    @ManyToOne
    @JoinColumn(name = "copropriétaire_id")
    private Copropriétaire copropriétaire;
    
    @ManyToOne
    @JoinColumn(name = "appartement_id")
    private Appartement appartement;
    
    @OneToMany(mappedBy = "cotisation", cascade = CascadeType.ALL)
    private List<Facture> factures;
}
