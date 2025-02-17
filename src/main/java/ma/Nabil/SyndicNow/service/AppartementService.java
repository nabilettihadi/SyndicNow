package ma.Nabil.SyndicNow.service;

import ma.Nabil.SyndicNow.domain.dto.appartement.AppartementCreateDTO;
import ma.Nabil.SyndicNow.domain.dto.appartement.AppartementResponseDTO;
import ma.Nabil.SyndicNow.domain.dto.appartement.AppartementUpdateDTO;

import java.util.List;

public interface AppartementService {
    AppartementResponseDTO createAppartement(AppartementCreateDTO dto);
    AppartementResponseDTO updateAppartement(Long id, AppartementUpdateDTO dto);
    AppartementResponseDTO getAppartementById(Long id);
    List<AppartementResponseDTO> getAllAppartements();
    void deleteAppartement(Long id);
}
