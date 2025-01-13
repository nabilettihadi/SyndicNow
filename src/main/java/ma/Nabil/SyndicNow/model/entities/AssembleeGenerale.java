package ma.Nabil.SyndicNow.model.entities;

import ma.Nabil.SyndicNow.model.enums.TypeAssemblee;
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
    
    @Temporal(TemporalType.TIMESTAMP)
    private Date date;
    
    private String sujet;
    private String ordreJour;
    private String lieuReunion;
    
    @Enumerated(EnumType.STRING)
    private TypeAssemblee type;
    
    @Column(length = 2000)
    private String decisions;
    
    @Column(length = 2000)
    private String procesVerbal;
    
    @ManyToOne
    @JoinColumn(name = "immeuble_id")
    private Immeuble immeuble;
    
    @ManyToMany
    @JoinTable(
        name = "presence_ag",
        joinColumns = @JoinColumn(name = "assemblee_id"),
        inverseJoinColumns = @JoinColumn(name = "copropriétaire_id")
    )
    private List<Copropriétaire> presents;
    
    @OneToMany(mappedBy = "assembleeGenerale", cascade = CascadeType.ALL)
    private List<Document> documents;
}
