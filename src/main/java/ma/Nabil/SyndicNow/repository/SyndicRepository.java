package ma.Nabil.SyndicNow.repository;

import ma.Nabil.SyndicNow.model.entities.Syndic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SyndicRepository extends JpaRepository<Syndic, Long> {
    Optional<Syndic> findByEmail(String email);
    boolean existsByEmail(String email);
}
