package ma.Nabil.SyndicNow.repository;

import ma.Nabil.SyndicNow.model.entities.Fournisseur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FournisseurRepository extends JpaRepository<Fournisseur, Long> {
    List<Fournisseur> findBySpecialiteContainingIgnoreCase(String specialite);
    List<Fournisseur> findByNomContainingIgnoreCase(String nom);
    boolean existsBySiret(String siret);
}
