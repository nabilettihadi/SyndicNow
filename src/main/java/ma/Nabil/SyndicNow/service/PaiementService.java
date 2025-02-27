package ma.Nabil.SyndicNow.service;

import ma.Nabil.SyndicNow.dto.paiement.PaiementCreateDTO;
import ma.Nabil.SyndicNow.dto.paiement.PaiementResponseDTO;
import ma.Nabil.SyndicNow.dto.paiement.PaiementUpdateDTO;

import java.util.List;

public interface PaiementService {
    PaiementResponseDTO createPaiement(PaiementCreateDTO dto);

    PaiementResponseDTO updatePaiement(Long id, PaiementUpdateDTO dto);

    PaiementResponseDTO getPaiementById(Long id);

    List<PaiementResponseDTO> getAllPaiements();

    void deletePaiement(Long id);
}
