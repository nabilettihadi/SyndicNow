package ma.Nabil.SyndicNow.model.entities;

import ma.Nabil.SyndicNow.model.enums.TypeDocument;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Document {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String titre;
    private String description;
    
    @Enumerated(EnumType.STRING)
    private TypeDocument type;
    
    @Temporal(TemporalType.TIMESTAMP)
    private Date dateCreation;
    
    private String fichierPath;
    private String reference;
    
    @ManyToOne
    @JoinColumn(name = "immeuble_id")
    private Immeuble immeuble;
    
    @ManyToOne
    @JoinColumn(name = "copropriétaire_id")
    private Copropriétaire copropriétaire;
    
    @ManyToOne
    @JoinColumn(name = "incident_id")
    private Incident incident;
}
