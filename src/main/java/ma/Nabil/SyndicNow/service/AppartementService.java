package ma.Nabil.SyndicNow.service;

import ma.Nabil.SyndicNow.domain.dto.appartement.AppartementCreateDTO;
import ma.Nabil.SyndicNow.domain.dto.appartement.AppartementResponseDTO;
import ma.Nabil.SyndicNow.domain.dto.appartement.AppartementUpdateDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AppartementService {
    AppartementResponseDTO createAppartement(AppartementCreateDTO dto);
    AppartementResponseDTO updateAppartement(Long id, AppartementUpdateDTO dto);
    AppartementResponseDTO getAppartementById(Long id);
    Page<AppartementResponseDTO> getAllAppartements(Pageable pageable);
    void deleteAppartement(Long id);
}
