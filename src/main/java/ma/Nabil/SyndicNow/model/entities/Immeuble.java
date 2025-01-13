package ma.Nabil.SyndicNow.model.entities;

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
public class Immeuble {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String nom;
    private String adresse;
    private String ville;
    private String codePostal;
    private int nombreEtages;
    private int nombreAppartements;
    private double surfaceTotale;
    
    @Temporal(TemporalType.DATE)
    private Date dateConstruction;
    
    @Temporal(TemporalType.DATE)
    private Date dateAjout;
    
    // Informations d'assurance
    private String numeroPoliceAssurance;
    private String compagnieAssurance;
    
    @Temporal(TemporalType.DATE)
    private Date dateExpirationAssurance;
    
    @ManyToOne
    @JoinColumn(name = "syndic_id")
    private Syndic syndic;
    
    @OneToMany(mappedBy = "immeuble", cascade = CascadeType.ALL)
    private List<Appartement> appartements;
    
    @OneToMany(mappedBy = "immeuble")
    private List<Budget> budgets;
    
    @OneToMany(mappedBy = "immeuble")
    private List<AssembleeGenerale> assemblees;
    
    @OneToMany(mappedBy = "immeuble")
    private List<Document> documents;
    
    @ElementCollection
    @CollectionTable(name = "equipements_immeuble")
    private List<String> equipements;
    
    @ElementCollection
    @CollectionTable(name = "contacts_urgence_immeuble")
    private List<String> contactsUrgence;
    
    // Méthodes utilitaires
    public double getSurfaceCommune() {
        if (appartements == null || appartements.isEmpty()) {
            return surfaceTotale;
        }
        double surfaceAppartements = appartements.stream()
                .mapToDouble(Appartement::getSurface)
                .sum();
        return surfaceTotale - surfaceAppartements;
    }
    
    public boolean isAssuranceValide() {
        return dateExpirationAssurance != null && 
               dateExpirationAssurance.after(new Date());
    }
    
    public long getNombreCopropriétaires() {
        if (appartements == null) return 0;
        return appartements.stream()
                .map(Appartement::getCopropriétaire)
                .distinct()
                .count();
    }
}
