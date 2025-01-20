package ma.Nabil.SyndicNow.service;

import ma.Nabil.SyndicNow.dto.syndic.SyndicCreateDTO;
import ma.Nabil.SyndicNow.dto.syndic.SyndicDTO;
import ma.Nabil.SyndicNow.dto.syndic.SyndicUpdateDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface SyndicService {
    SyndicDTO createSyndic(SyndicCreateDTO createDTO);
    SyndicDTO updateSyndic(Long id, SyndicUpdateDTO updateDTO);
    SyndicDTO getSyndicById(Long id);
    Page<SyndicDTO> getAllSyndics(Pageable pageable);
    void deleteSyndic(Long id);
    boolean existsById(Long id);
}
