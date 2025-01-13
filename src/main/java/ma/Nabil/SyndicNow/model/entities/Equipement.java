package ma.Nabil.SyndicNow.model.entities;

import ma.Nabil.SyndicNow.model.enums.TypeEquipement;
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
public class Equipement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String nom;
    private String marque;
    private String modele;
    private String numeroSerie;
    
    @Enumerated(EnumType.STRING)
    private TypeEquipement type;
    
    @Temporal(TemporalType.DATE)
    private Date dateMiseEnService;
    
    @Temporal(TemporalType.DATE)
    private Date dateDernierEntretien;
    
    @Temporal(TemporalType.DATE)
    private Date dateProchainEntretien;
    
    private String etatActuel;
    private String observations;
    
    @ManyToOne
    @JoinColumn(name = "immeuble_id")
    private Immeuble immeuble;
    
    @ManyToOne
    @JoinColumn(name = "fournisseur_id")
    private Fournisseur fournisseurMaintenance;
    
    @OneToMany(mappedBy = "equipement")
    private List<Document> documents;
    
    @OneToMany(mappedBy = "equipement")
    private List<Transaction> transactions;
    
    // Méthodes utilitaires
    public boolean needsMaintenance() {
        if (dateProchainEntretien == null) return false;
        return new Date().after(dateProchainEntretien);
    }
    
    public long getJoursAvantProchainEntretien() {
        if (dateProchainEntretien == null) return -1;
        return (dateProchainEntretien.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24);
    }
}
