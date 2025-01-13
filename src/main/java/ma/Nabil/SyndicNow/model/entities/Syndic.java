package ma.Nabil.SyndicNow.model.entities;

import ma.Nabil.SyndicNow.model.enums.StatutSyndic;
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
public class Syndic {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String nom;
    private String adresse;
    private String email;
    private String telephone;
    private String raisonSociale;
    private String registreCommerce;
    private String identifiantFiscal;
    
    @Enumerated(EnumType.STRING)
    private StatutSyndic statut;
    
    @Temporal(TemporalType.DATE)
    private Date dateCreation;
    
    @OneToMany(mappedBy = "syndic", cascade = CascadeType.ALL)
    private List<Immeuble> immeubles;
    
    @OneToMany(mappedBy = "syndic")
    private List<Document> documents;
    
    @ElementCollection
    @CollectionTable(name = "coordonnees_bancaires_syndic")
    private List<String> coordonneesBancaires;
    
    @ElementCollection
    @CollectionTable(name = "contacts_syndic")
    private List<String> contactsUrgence;
    
    // Méthodes utilitaires
    public boolean isActif() {
        return statut == StatutSyndic.ACTIF;
    }
    
    public int getNombreImmeubles() {
        return immeubles != null ? immeubles.size() : 0;
    }
}
