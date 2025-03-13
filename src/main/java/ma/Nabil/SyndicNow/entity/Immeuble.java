package ma.Nabil.SyndicNow.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Immeuble {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String nom;
    
    @Column(nullable = false)
    private String adresse;
    
    @Column(nullable = false)
    private String codePostal;
    
    @Column(nullable = false)
    private String ville;
    
    @Column(nullable = false)
    private Integer nombreEtages;
    
    @Column(nullable = false)
    private Integer nombreAppartements;
    
    @Column(nullable = false)
    private Integer anneeConstruction;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "syndic_id", nullable = false)
    private Syndic syndic;
    
    @OneToMany(mappedBy = "immeuble", cascade = CascadeType.ALL)
    private List<Appartement> appartements = new ArrayList<>();
    
    private String description;
    
    @Column(nullable = false)
    private LocalDateTime dateCreation;
    
    @Column(nullable = false)
    private LocalDateTime dateModification;
    
    @PrePersist
    protected void onCreate() {
        dateCreation = LocalDateTime.now();
        dateModification = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        dateModification = LocalDateTime.now();
    }
}
