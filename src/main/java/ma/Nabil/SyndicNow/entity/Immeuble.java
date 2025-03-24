package ma.Nabil.SyndicNow.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "immeubles")
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
    private String ville;

    @Column(name = "code_postal")
    private String codePostal;

    @Column(name = "nombre_etages")
    private Integer nombreEtages;

    @Column(name = "nombre_appartements")
    private Integer nombreAppartements;

    @Column(name = "annee_construction")
    private Integer anneeConstruction;

    @Column(length = 1000)
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "syndic_id", nullable = false)
    private Syndic syndic;

    @OneToMany(mappedBy = "immeuble", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Appartement> appartements = new ArrayList<>();

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Méthodes utilitaires pour gérer la relation bidirectionnelle
    public void addAppartement(Appartement appartement) {
        appartements.add(appartement);
        appartement.setImmeuble(this);
    }

    public void removeAppartement(Appartement appartement) {
        appartements.remove(appartement);
        appartement.setImmeuble(null);
    }

    // Getters pour la compatibilité avec le mapper
    public LocalDateTime getDateCreation() {
        return createdAt;
    }

    public LocalDateTime getDateModification() {
        return updatedAt;
    }

    // Setters pour la compatibilité avec le mapper
    public void setDateCreation(LocalDateTime dateCreation) {
        this.createdAt = dateCreation;
    }

    public void setDateModification(LocalDateTime dateModification) {
        this.updatedAt = dateModification;
    }
}
