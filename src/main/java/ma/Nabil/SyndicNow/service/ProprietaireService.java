package ma.Nabil.SyndicNow.service;

import ma.Nabil.SyndicNow.domain.dto.proprietaire.ProprietaireCreateDTO;
import ma.Nabil.SyndicNow.domain.dto.proprietaire.ProprietaireResponseDTO;
import ma.Nabil.SyndicNow.domain.dto.proprietaire.ProprietaireUpdateDTO;

import java.util.List;

public interface ProprietaireService {
    ProprietaireResponseDTO createProprietaire(ProprietaireCreateDTO dto);
    ProprietaireResponseDTO updateProprietaire(Long id, ProprietaireUpdateDTO dto);
    ProprietaireResponseDTO getProprietaireById(Long id);
    List<ProprietaireResponseDTO> getAllProprietaires();
    void deleteProprietaire(Long id);
}
