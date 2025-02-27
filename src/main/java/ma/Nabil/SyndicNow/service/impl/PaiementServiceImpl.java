package ma.Nabil.SyndicNow.service.impl;

import ma.Nabil.SyndicNow.dto.paiement.PaiementCreateDTO;
import ma.Nabil.SyndicNow.dto.paiement.PaiementResponseDTO;
import ma.Nabil.SyndicNow.dto.paiement.PaiementUpdateDTO;
import ma.Nabil.SyndicNow.entity.Paiement;
import ma.Nabil.SyndicNow.mapper.PaiementMapper;
import ma.Nabil.SyndicNow.repository.PaiementRepository;
import ma.Nabil.SyndicNow.service.PaiementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PaiementServiceImpl implements PaiementService {

    @Autowired
    private PaiementRepository paiementRepository;

    @Autowired
    private PaiementMapper paiementMapper;

    @Override
    public PaiementResponseDTO createPaiement(PaiementCreateDTO dto) {
        Paiement paiement = paiementMapper.toEntity(dto);
        paiement = paiementRepository.save(paiement);
        return paiementMapper.toResponseDto(paiement);
    }

    @Override
    public PaiementResponseDTO updatePaiement(Long id, PaiementUpdateDTO dto) {
        Paiement paiement = paiementRepository.findById(id).orElseThrow(() -> new RuntimeException("Paiement not found"));
        paiementMapper.updateEntityFromDto(dto, paiement);
        paiement = paiementRepository.save(paiement);
        return paiementMapper.toResponseDto(paiement);
    }

    @Override
    public PaiementResponseDTO getPaiementById(Long id) {
        Paiement paiement = paiementRepository.findById(id).orElseThrow(() -> new RuntimeException("Paiement not found"));
        return paiementMapper.toResponseDto(paiement);
    }

    @Override
    public List<PaiementResponseDTO> getAllPaiements() {
        return paiementRepository.findAll().stream().map(paiementMapper::toResponseDto).collect(Collectors.toList());
    }

    @Override
    public void deletePaiement(Long id) {
        paiementRepository.deleteById(id);
    }
}
