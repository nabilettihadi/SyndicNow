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
    
    private String validePar; // Field for the validator
    private Date dateValidation; // Field for the validation date
    private String commentairesValidation; // Field for validation comments
    
    @ManyToOne
    @JoinColumn(name = "equipement_id")
    private Equipement equipement;
    
    @ManyToOne
    @JoinColumn(name = "fournisseur_id")
    private Fournisseur fournisseur;
    
    @OneToMany(mappedBy = "intervention")
    private List<ActionIntervention> historiqueActions; // Added field for historical actions
    
    @OneToMany(mappedBy = "intervention")
    private List<Document> documents;
    
    @OneToOne
    private Transaction transaction;
    
    @ElementCollection
    @CollectionTable(name = "pieces_changees")
    private List<String> piecesChangees;

    public Double getCoutMateriel() {
        return cout; // Assuming 'cout' is the material cost
    }

    public Double getCoutMainOeuvre() {
        // Assuming there's a field for labor cost, which is not currently defined
        return 0.0; // Placeholder, update with actual logic if available
    }

    public List<ActionIntervention> getHistoriqueActions() {
        return historiqueActions; // Returns the list of historical actions
    }

    public void setHistoriqueActions(List<ActionIntervention> historiqueActions) {
        this.historiqueActions = historiqueActions; // Setter for historical actions
    }

    public void setValidePar(String validePar) {
        this.validePar = validePar; // Setter for the validator
    }

    public void setDateValidation(Date dateValidation) {
        this.dateValidation = dateValidation; // Setter for the validation date
    }

    public void setCommentairesValidation(String commentairesValidation) {
        this.commentairesValidation = commentairesValidation; // Setter for validation comments
    }

    public void setNouveauStatut(StatutIntervention nouveauStatut) {
        this.nouveauStatut = nouveauStatut; // Setter for the new status
    }

    public void setStatutPrecedent(StatutIntervention statutPrecedent) {
        this.statutPrecedent = statutPrecedent; // Setter for the previous status
    }

    public void setDateDebut(Date dateDebut) {
        this.dateDebut = dateDebut; // Setter for the start date
    }

    public boolean isTerminee() {
        return dateFin != null;
    }
    
    public long getDuree() {
        if (dateIntervention == null) return 0;
        Date fin = dateFin != null ? dateFin : new Date();
        return (fin.getTime() - dateIntervention.getTime()) / (1000 * 60 * 60);
    }
}
