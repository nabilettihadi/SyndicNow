package ma.Nabil.SyndicNow.model.entities;

import ma.Nabil.SyndicNow.model.enums.PrioriteIncident;
import ma.Nabil.SyndicNow.model.enums.StatutIncident;
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
public class Incident {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String description;
    
    @Temporal(TemporalType.TIMESTAMP)
    private Date dateSignalement;
    
    @Enumerated(EnumType.STRING)
    private StatutIncident status;
    
    @Enumerated(EnumType.STRING)
    private PrioriteIncident priorite;
    
    private double cout;
    
    @ElementCollection
    private List<String> photos;
    
    @ElementCollection
    @Column(length = 1000)
    private List<String> commentaires;
    
    @ManyToOne
    @JoinColumn(name = "appartement_id")
    private Appartement appartement;
    
    @ManyToOne
    @JoinColumn(name = "copropriétaire_id")
    private Copropriétaire copropriétaire;
    
    @ManyToOne
    @JoinColumn(name = "fournisseur_id")
    private Fournisseur fournisseur;
}
