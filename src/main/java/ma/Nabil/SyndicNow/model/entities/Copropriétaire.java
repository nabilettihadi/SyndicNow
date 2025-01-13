package ma.Nabil.SyndicNow.model.entities;

import ma.Nabil.SyndicNow.model.enums.TypeProprietaire;
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
public class Copropriétaire {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String nom;
    private String prenom;
    private String email;
    private String telephone;
    private String adressePostale;
    
    @Temporal(TemporalType.DATE)
    private Date dateAcquisition;
    
    @Enumerated(EnumType.STRING)
    private TypeProprietaire typeProprietaire;
    
    @OneToMany(mappedBy = "copropriétaire")
    private List<Appartement> appartements;
    
    @OneToMany(mappedBy = "copropriétaire")
    private List<Incident> incidents;
}
