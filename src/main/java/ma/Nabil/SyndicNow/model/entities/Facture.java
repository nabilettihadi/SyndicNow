package ma.Nabil.SyndicNow.model.entities;

import ma.Nabil.SyndicNow.model.enums.StatutFacture;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Facture {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String numero;
    
    @Temporal(TemporalType.DATE)
    private Date dateEmission;
    
    @Temporal(TemporalType.DATE)
    private Date dateEcheance;
    
    private double montant;
    private String description;
    
    @Enumerated(EnumType.STRING)
    private StatutFacture statut;
    
    private String fichierPath;
    
    @ManyToOne
    @JoinColumn(name = "cotisation_id")
    private Cotisation cotisation;
    
    @ManyToOne
    @JoinColumn(name = "incident_id")
    private Incident incident;
}
