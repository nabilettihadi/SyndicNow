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
    private String numeroAgrement;
    
    @Temporal(TemporalType.TIMESTAMP)
    private Date dateCreation;
    
    @Enumerated(EnumType.STRING)
    private StatutSyndic statut;
    
    @OneToMany(mappedBy = "syndic", cascade = CascadeType.ALL)
    private List<Immeuble> immeubles;
}
