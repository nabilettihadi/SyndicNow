package ma.Nabil.SyndicNow.model.entities;

import ma.Nabil.SyndicNow.model.enums.TypeDepense;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Depense {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Enumerated(EnumType.STRING)
    private TypeDepense type;
    
    private double montant;
    
    @Temporal(TemporalType.DATE)
    private Date date;
    
    private String description;
    private String justificatif;
    private boolean validee;
    
    @ManyToOne
    @JoinColumn(name = "budget_id")
    private Budget budget;
    
    @ManyToOne
    @JoinColumn(name = "immeuble_id")
    private Immeuble immeuble;
    
    @ManyToOne
    @JoinColumn(name = "fournisseur_id")
    private Fournisseur fournisseur;
    
    @OneToOne(mappedBy = "depense", cascade = CascadeType.ALL)
    private Facture facture;
}
