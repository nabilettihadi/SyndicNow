package ma.Nabil.SyndicNow.repository;

import ma.Nabil.SyndicNow.model.entities.Immeuble;
import ma.Nabil.SyndicNow.model.entities.Syndic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ImmeubleRepository extends JpaRepository<Immeuble, Long> {
    List<Immeuble> findBySyndic(Syndic syndic);
    List<Immeuble> findByAdresseContainingIgnoreCase(String adresse);
    boolean existsByNomAndSyndic(String nom, Syndic syndic);
}
