package ma.Nabil.SyndicNow.model.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;
import java.util.Map;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Budget {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private int annee;
    private double montantPrevisionnel;
    private double montantReel;
    
    @Temporal(TemporalType.DATE)
    private Date dateDebut;
    
    @Temporal(TemporalType.DATE)
    private Date dateFin;
    
    @ElementCollection
    @CollectionTable(name = "budget_details")
    @MapKeyColumn(name = "type_depense")
    @Column(name = "montant")
    private Map<String, Double> detailsDepenses;
    
    private String commentaires;
    
    @ManyToOne
    @JoinColumn(name = "immeuble_id")
    private Immeuble immeuble;
    
    @OneToMany(mappedBy = "budget", cascade = CascadeType.ALL)
    private List<Transaction> transactions;
    
    @OneToMany(mappedBy = "budget", cascade = CascadeType.ALL)
    private List<Document> documents;
}
