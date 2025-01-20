package ma.Nabil.SyndicNow.service;

import ma.Nabil.SyndicNow.dto.reclamation.ReclamationCreateDTO;
import ma.Nabil.SyndicNow.dto.reclamation.ReclamationDTO;
import ma.Nabil.SyndicNow.dto.reclamation.ReclamationUpdateDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ReclamationService {
    ReclamationDTO createReclamation(ReclamationCreateDTO createDTO);
    ReclamationDTO updateReclamation(Long id, ReclamationUpdateDTO updateDTO);
    ReclamationDTO getReclamationById(Long id);
    Page<ReclamationDTO> getAllReclamations(Pageable pageable);
    Page<ReclamationDTO> getReclamationsByCopropriétaire(Long copropriétaireId, Pageable pageable);
    Page<ReclamationDTO> getReclamationsByImmeuble(Long immeubleId, Pageable pageable);
    Page<ReclamationDTO> getReclamationsByStatus(String status, Pageable pageable);
    void deleteReclamation(Long id);
    boolean existsById(Long id);
    ReclamationDTO changeStatus(Long id, String newStatus);
}
