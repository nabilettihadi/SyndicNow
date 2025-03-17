package ma.Nabil.SyndicNow.repository;

import ma.Nabil.SyndicNow.entity.Proprietaire;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProprietaireRepository extends JpaRepository<Proprietaire, Long> {
    Optional<Proprietaire> findByEmail(String email);

    boolean existsByEmail(String email);

    Optional<Proprietaire> findByCin(String cin);

    @Query("SELECT p FROM Proprietaire p WHERE " + "LOWER(p.nom) LIKE LOWER(CONCAT('%', :search, '%')) OR " + "LOWER(p.prenom) LIKE LOWER(CONCAT('%', :search, '%')) OR " + "LOWER(p.email) LIKE LOWER(CONCAT('%', :search, '%'))")
    Page<Proprietaire> searchProprietaires(@Param("search") String search, Pageable pageable);

    @Query("SELECT p FROM Proprietaire p LEFT JOIN FETCH p.appartements WHERE p.id = :id")
    Optional<Proprietaire> findByIdWithAppartements(@Param("id") Long id);

    @Query("SELECT COUNT(a) FROM Proprietaire p JOIN p.appartements a WHERE p.id = :proprietaireId")
    long countAppartements(@Param("proprietaireId") Long proprietaireId);

    @Query("SELECT p FROM Proprietaire p JOIN p.appartements a WHERE a.immeuble.id = :immeubleId")
    List<Proprietaire> findByImmeubleId(@Param("immeubleId") Long immeubleId);

    @Query("SELECT p FROM Proprietaire p WHERE p.telephone = :telephone")
    Optional<Proprietaire> findByTelephone(@Param("telephone") String telephone);
}
