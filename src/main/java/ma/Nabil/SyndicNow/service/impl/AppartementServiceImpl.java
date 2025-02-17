package ma.Nabil.SyndicNow.service.impl;

import ma.Nabil.SyndicNow.domain.dto.appartement.AppartementCreateDTO;
import ma.Nabil.SyndicNow.domain.dto.appartement.AppartementResponseDTO;
import ma.Nabil.SyndicNow.domain.dto.appartement.AppartementUpdateDTO;
import ma.Nabil.SyndicNow.domain.entity.Appartement;
import ma.Nabil.SyndicNow.domain.mapper.AppartementMapper;
import ma.Nabil.SyndicNow.repository.AppartementRepository;
import ma.Nabil.SyndicNow.service.AppartementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AppartementServiceImpl implements AppartementService {

    @Autowired
    private AppartementRepository appartementRepository;

    @Autowired
    private AppartementMapper appartementMapper;

    @Override
    public AppartementResponseDTO createAppartement(AppartementCreateDTO dto) {
        Appartement appartement = appartementMapper.toEntity(dto);
        appartement = appartementRepository.save(appartement);
        return appartementMapper.toResponseDto(appartement);
    }

    @Override
    public AppartementResponseDTO updateAppartement(Long id, AppartementUpdateDTO dto) {
        Appartement appartement = appartementRepository.findById(id).orElseThrow(() -> new RuntimeException("Appartement not found"));
        appartementMapper.updateEntityFromDto(dto, appartement);
        appartement = appartementRepository.save(appartement);
        return appartementMapper.toResponseDto(appartement);
    }

    @Override
    public AppartementResponseDTO getAppartementById(Long id) {
        Appartement appartement = appartementRepository.findById(id).orElseThrow(() -> new RuntimeException("Appartement not found"));
        return appartementMapper.toResponseDto(appartement);
    }

    @Override
    public List<AppartementResponseDTO> getAllAppartements() {
        return appartementRepository.findAll().stream().map(appartementMapper::toResponseDto).collect(Collectors.toList());
    }

    @Override
    public void deleteAppartement(Long id) {
        appartementRepository.deleteById(id);
    }
}
