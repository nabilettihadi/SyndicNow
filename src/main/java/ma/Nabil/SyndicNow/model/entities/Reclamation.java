package ma.Nabil.SyndicNow.model.entities;

import ma.Nabil.SyndicNow.model.enums.StatutReclamation;
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
public class Reclamation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String reference;
    private String sujet;
    
    @Column(length = 1000)
    private String description;
    
    @Enumerated(EnumType.STRING)
    private StatutReclamation statut;
    
    @Temporal(TemporalType.TIMESTAMP)
    private Date dateCreation;
    
    @Temporal(TemporalType.TIMESTAMP)
    private Date dateDerniereModification;
    
    @Temporal(TemporalType.TIMESTAMP)
    private Date dateCloture;
    
    @ManyToOne
    @JoinColumn(name = "copropriétaire_id")
    private Copropriétaire copropriétaire;
    
    @ManyToOne
    @JoinColumn(name = "appartement_id")
    private Appartement appartement;
    
    @OneToMany(mappedBy = "reclamation", cascade = CascadeType.ALL)
    private List<Document> documents;
    
    @ElementCollection
    @CollectionTable(name = "historique_reclamation")
    @Column(length = 1000)
    private List<String> historiqueActions;
    
    public void ajouterAction(String action) {
        if (historiqueActions == null) {
            historiqueActions = new java.util.ArrayList<>();
        }
        historiqueActions.add(action);
        dateDerniereModification = new Date();
    }
    
    public boolean isActive() {
        return statut != StatutReclamation.RESOLUE && 
               statut != StatutReclamation.REJETEE && 
               statut != StatutReclamation.FERMEE;
    }
    
    public long getDureeTraitement() {
        if (dateCreation == null) return 0;
        Date fin = dateCloture != null ? dateCloture : new Date();
        return (fin.getTime() - dateCreation.getTime()) / (1000 * 60 * 60 * 24);
    }
}
