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
public class AssembleeGenerale {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String sujet;
    
    @Column(length = 2000)
    private String ordreJour;
    
    @Temporal(TemporalType.TIMESTAMP)
    private Date dateAssemblee;
    
    @Column(length = 5000)
    private String decisions;
    
    private String lieu;
    
    @ManyToOne
    @JoinColumn(name = "immeuble_id")
    private Immeuble immeuble;
    
    @ManyToMany
    @JoinTable(
        name = "presence_assemblee",
        joinColumns = @JoinColumn(name = "assemblee_id"),
        inverseJoinColumns = @JoinColumn(name = "copropriétaire_id")
    )
    private List<Copropriétaire> presents;
    
    @OneToMany(mappedBy = "assembleeGenerale")
    private List<Document> documents;
    
    @ElementCollection
    @CollectionTable(name = "procurations_ag")
    @MapKeyColumn(name = "copropriétaire_id")
    @Column(name = "mandataire_id")
    private List<String> procurations;
}
