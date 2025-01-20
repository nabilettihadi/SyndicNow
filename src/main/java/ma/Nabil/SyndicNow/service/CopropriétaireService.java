package ma.Nabil.SyndicNow.service;

import ma.Nabil.SyndicNow.dto.copropriétaire.CopropriétaireCreateDTO;
import ma.Nabil.SyndicNow.dto.copropriétaire.CopropriétaireDTO;
import ma.Nabil.SyndicNow.dto.copropriétaire.CopropriétaireUpdateDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface CopropriétaireService {
    CopropriétaireDTO createCopropriétaire(CopropriétaireCreateDTO createDTO);
    CopropriétaireDTO updateCopropriétaire(Long id, CopropriétaireUpdateDTO updateDTO);
    CopropriétaireDTO getCopropriétaireById(Long id);
    Page<CopropriétaireDTO> getAllCopropriétaires(Pageable pageable);
    Page<CopropriétaireDTO> getCopropriétairesByAppartement(Long appartementId, Pageable pageable);
    Page<CopropriétaireDTO> getCopropriétairesByImmeuble(Long immeubleId, Pageable pageable);
    void deleteCopropriétaire(Long id);
    boolean existsById(Long id);
}
