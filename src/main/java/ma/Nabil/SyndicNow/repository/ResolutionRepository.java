package ma.Nabil.SyndicNow.repository;

import ma.Nabil.SyndicNow.model.entities.Resolution;
import ma.Nabil.SyndicNow.model.entities.AssembleeGenerale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResolutionRepository extends JpaRepository<Resolution, Long> {
    List<Resolution> findByAssemblee(AssembleeGenerale assemblee);
    List<Resolution> findByAdopteeTrue();
    List<Resolution> findByAssembleeAndAdoptee(AssembleeGenerale assemblee, boolean adoptee);
}
