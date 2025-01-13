package ma.Nabil.SyndicNow.model.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

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
    private int nombreEtages;
    private int anneeConstruction;
    private double surfaceTotale;
    private String assurance;
    private String reglementCopropriete;
    private int nombreLots;
    
    @ManyToOne
    @JoinColumn(name = "syndic_id")
    private Syndic syndic;
    
    @OneToMany(mappedBy = "immeuble", cascade = CascadeType.ALL)
    private List<Appartement> appartements;
}
