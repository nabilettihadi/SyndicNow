package ma.Nabil.SyndicNow.repository;

import ma.Nabil.SyndicNow.entity.Document;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {
    @Query("SELECT d FROM Document d WHERE d.immeuble.id = :immeubleId")
    List<Document> findByImmeubleId(@Param("immeubleId") Long immeubleId);

    @Query("SELECT d FROM Document d WHERE d.immeuble.syndic.id = :syndicId")
    List<Document> findBySyndicId(@Param("syndicId") Long syndicId);

    @Query("SELECT DISTINCT d FROM Document d JOIN d.immeuble i JOIN i.appartements a WHERE a.proprietaire.id = :proprietaireId")
    List<Document> findByProprietaireId(@Param("proprietaireId") Long proprietaireId);

    @Query("SELECT d FROM Document d WHERE " + "LOWER(d.nom) LIKE LOWER(CONCAT('%', :search, '%')) OR " + "LOWER(d.description) LIKE LOWER(CONCAT('%', :search, '%'))")
    Page<Document> searchDocuments(@Param("search") String search, Pageable pageable);

    @Query("SELECT d FROM Document d WHERE d.createdAt BETWEEN :debut AND :fin")
    List<Document> findByPeriode(@Param("debut") LocalDateTime debut, @Param("fin") LocalDateTime fin);

    @Query("SELECT d FROM Document d WHERE d.type = :type")
    List<Document> findByType(@Param("type") String type);

    @Query("SELECT DISTINCT d.type FROM Document d")
    List<String> findAllTypes();

    boolean existsByNomAndImmeubleId(String nom, Long immeubleId);

    @Query("SELECT d FROM Document d WHERE d.immeuble.id = :immeubleId AND " + "(:search IS NULL OR LOWER(d.nom) LIKE LOWER(CONCAT('%', :search, '%')) OR " + "LOWER(d.description) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Document> findByImmeubleIdAndSearch(@Param("immeubleId") Long immeubleId, @Param("search") String search, Pageable pageable);
}
