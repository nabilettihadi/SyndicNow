package ma.Nabil.SyndicNow.repository;

import ma.Nabil.SyndicNow.domain.entity.Syndic;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SyndicRepository extends BaseRepository<Syndic, Long> {
    Optional<Syndic> findByEmail(String email);

    boolean existsByEmail(String email);
}
