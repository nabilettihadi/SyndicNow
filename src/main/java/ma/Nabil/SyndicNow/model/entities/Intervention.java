package ma.Nabil.SyndicNow.model.entities;

import ma.Nabil.SyndicNow.model.enums.TypeIntervention;
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
public class Intervention {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Enumerated(EnumType.STRING)
    private TypeIntervention type;
    
    @Column(length = 1000)
    private String description;
    
    @Temporal(TemporalType.TIMESTAMP)
    private Date dateIntervention;
    
    @Temporal(TemporalType.TIMESTAMP)
    private Date dateFin;
    
    private double cout;
    private String rapport;
    private boolean urgente;
    
    @ManyToOne
    @JoinColumn(name = "equipement_id")
    private Equipement equipement;
    
    @ManyToOne
    @JoinColumn(name = "fournisseur_id")
    private Fournisseur fournisseur;
    
    @OneToMany(mappedBy = "intervention")
    private List<Document> documents;
    
    @OneToOne
    private Transaction transaction;
    
    @ElementCollection
    @CollectionTable(name = "pieces_changees")
    private List<String> piecesChangees;
    
    public boolean isTerminee() {
        return dateFin != null;
    }
    
    public long getDuree() {
        if (dateIntervention == null) return 0;
        Date fin = dateFin != null ? dateFin : new Date();
        return (fin.getTime() - dateIntervention.getTime()) / (1000 * 60 * 60);
    }
}
