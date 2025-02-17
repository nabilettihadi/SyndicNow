package ma.Nabil.SyndicNow.service.impl;

import ma.Nabil.SyndicNow.domain.dto.proprietaire.ProprietaireCreateDTO;
import ma.Nabil.SyndicNow.domain.dto.proprietaire.ProprietaireResponseDTO;
import ma.Nabil.SyndicNow.domain.dto.proprietaire.ProprietaireUpdateDTO;
import ma.Nabil.SyndicNow.domain.entity.Proprietaire;
import ma.Nabil.SyndicNow.domain.mapper.ProprietaireMapper;
import ma.Nabil.SyndicNow.repository.ProprietaireRepository;
import ma.Nabil.SyndicNow.service.ProprietaireService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProprietaireServiceImpl implements ProprietaireService {

    @Autowired
    private ProprietaireRepository proprietaireRepository;

    @Autowired
    private ProprietaireMapper proprietaireMapper;

    @Override
    public ProprietaireResponseDTO createProprietaire(ProprietaireCreateDTO dto) {
        Proprietaire proprietaire = proprietaireMapper.toEntity(dto);
        proprietaire = proprietaireRepository.save(proprietaire);
        return proprietaireMapper.toResponseDto(proprietaire);
    }

    @Override
    public ProprietaireResponseDTO updateProprietaire(Long id, ProprietaireUpdateDTO dto) {
        Proprietaire proprietaire = proprietaireRepository.findById(id).orElseThrow(() -> new RuntimeException("Proprietaire not found"));
        proprietaireMapper.updateEntityFromDto(dto, proprietaire);
        proprietaire = proprietaireRepository.save(proprietaire);
        return proprietaireMapper.toResponseDto(proprietaire);
    }

    @Override
    public ProprietaireResponseDTO getProprietaireById(Long id) {
        Proprietaire proprietaire = proprietaireRepository.findById(id).orElseThrow(() -> new RuntimeException("Proprietaire not found"));
        return proprietaireMapper.toResponseDto(proprietaire);
    }

    @Override
    public List<ProprietaireResponseDTO> getAllProprietaires() {
        return proprietaireRepository.findAll().stream().map(proprietaireMapper::toResponseDto).collect(Collectors.toList());
    }

    @Override
    public void deleteProprietaire(Long id) {
        proprietaireRepository.deleteById(id);
    }
}
