package ma.Nabil.SyndicNow.model.entities;

import ma.Nabil.SyndicNow.model.enums.TypeTransaction;
import ma.Nabil.SyndicNow.model.enums.StatutTransaction;
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
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String reference;
    private double montant;
    
    @Column(length = 1000)
    private String description;
    
    @Temporal(TemporalType.TIMESTAMP)
    private Date dateTransaction;
    
    @Temporal(TemporalType.DATE)
    private Date dateEcheance;
    
    private String periode;  // Pour les cotisations (ex: "2024-T1")
    
    @Enumerated(EnumType.STRING)
    private TypeTransaction type;
    
    @Enumerated(EnumType.STRING)
    private StatutTransaction statut;
    
    @ManyToOne
    @JoinColumn(name = "appartement_id")
    private Appartement appartement;
    
    @ManyToOne
    @JoinColumn(name = "copropriétaire_id")
    private Copropriétaire copropriétaire;
    
    @ManyToOne
    @JoinColumn(name = "budget_id")
    private Budget budget;
    
    @ManyToOne
    @JoinColumn(name = "fournisseur_id")
    private Fournisseur fournisseur;
    
    @OneToMany(mappedBy = "transaction", cascade = CascadeType.ALL)
    private List<Document> documents;
}
