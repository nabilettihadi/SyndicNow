package ma.Nabil.SyndicNow.service;

import ma.Nabil.SyndicNow.domain.dto.syndic.SyndicCreateDTO;
import ma.Nabil.SyndicNow.domain.dto.syndic.SyndicResponseDTO;
import ma.Nabil.SyndicNow.domain.dto.syndic.SyndicUpdateDTO;

import java.util.List;

public interface SyndicService {
    SyndicResponseDTO createSyndic(SyndicCreateDTO dto);

    SyndicResponseDTO updateSyndic(Long id, SyndicUpdateDTO dto);

    SyndicResponseDTO getSyndicById(Long id);

    List<SyndicResponseDTO> getAllSyndics();

    void deleteSyndic(Long id);
}
