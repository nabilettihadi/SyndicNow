package ma.Nabil.SyndicNow.service;

import ma.Nabil.SyndicNow.dto.appartement.AppartementCreateDTO;
import ma.Nabil.SyndicNow.dto.appartement.AppartementDTO;
import ma.Nabil.SyndicNow.dto.appartement.AppartementUpdateDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AppartementService {
    AppartementDTO createAppartement(AppartementCreateDTO createDTO);
    AppartementDTO updateAppartement(Long id, AppartementUpdateDTO updateDTO);
    AppartementDTO getAppartementById(Long id);
    Page<AppartementDTO> getAllAppartements(Pageable pageable);
    Page<AppartementDTO> getAppartementsByImmeuble(Long immeubleId, Pageable pageable);
    void deleteAppartement(Long id);
    boolean existsById(Long id);
}
