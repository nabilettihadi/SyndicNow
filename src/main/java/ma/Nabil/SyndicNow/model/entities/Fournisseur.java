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
public class Fournisseur {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String nom;
    private String specialite;
    private String telephone;
    private String email;
    private String siret;
    private String assurance;
    private double tarifHoraire;
    
    @OneToMany(mappedBy = "fournisseur")
    private List<Incident> incidents;
}
