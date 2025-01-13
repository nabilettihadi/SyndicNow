package ma.Nabil.SyndicNow.model.entities;

import ma.Nabil.SyndicNow.model.enums.TypeDocument;
import ma.Nabil.SyndicNow.model.enums.StatutDocument;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Document {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String reference;
    private String titre;
    
    @Column(length = 1000)
    private String description;
    
    @Enumerated(EnumType.STRING)
    private TypeDocument type;
    
    @Enumerated(EnumType.STRING)
    private StatutDocument statut;
    
    private double montant;  // Pour les factures
    
    @Temporal(TemporalType.TIMESTAMP)
    private Date dateCreation;
    
    @Temporal(TemporalType.DATE)
    private Date dateEcheance;  // Pour les factures et contrats
    
    private String fichierPath;
    
    @ManyToOne
    @JoinColumn(name = "immeuble_id")
    private Immeuble immeuble;
    
    @ManyToOne
    @JoinColumn(name = "copropriétaire_id")
    private Copropriétaire copropriétaire;
    
    @ManyToOne
    @JoinColumn(name = "incident_id")
    private Incident incident;
    
    @ManyToOne
    @JoinColumn(name = "transaction_id")
    private Transaction transaction;
    
    @ManyToOne
    @JoinColumn(name = "assemblee_id")
    private AssembleeGenerale assembleeGenerale;
}
