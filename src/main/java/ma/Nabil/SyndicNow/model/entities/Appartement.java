package ma.Nabil.SyndicNow.model.entities;

import ma.Nabil.SyndicNow.model.enums.TypeAppartement;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Appartement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String numero;
    private double surface;
    private int etage;
    private double quotePart;
    
    @Enumerated(EnumType.STRING)
    private TypeAppartement type;
    
    @ManyToOne
    @JoinColumn(name = "immeuble_id")
    private Immeuble immeuble;
    
    @ManyToOne
    @JoinColumn(name = "copropriétaire_id")
    private Copropriétaire copropriétaire;
    
    @OneToMany(mappedBy = "appartement")
    private List<Incident> incidents;
    
    @OneToMany(mappedBy = "appartement")
    private List<Transaction> transactions;
    
    @OneToMany(mappedBy = "appartement")
    private List<Document> documents;
}
