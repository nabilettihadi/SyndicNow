package ma.Nabil.SyndicNow.service.impl;

import lombok.RequiredArgsConstructor;
import ma.Nabil.SyndicNow.dto.proprietaire.ProprietaireRequest;
import ma.Nabil.SyndicNow.dto.proprietaire.ProprietaireResponse;
import ma.Nabil.SyndicNow.entity.Proprietaire;
import ma.Nabil.SyndicNow.mapper.ProprietaireMapper;
import ma.Nabil.SyndicNow.repository.ProprietaireRepository;
import ma.Nabil.SyndicNow.service.ProprietaireService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ProprietaireServiceImpl implements ProprietaireService {

    private final ProprietaireRepository proprietaireRepository;
    private final ProprietaireMapper proprietaireMapper;

    @Override
    public ProprietaireResponse createProprietaire(ProprietaireRequest request) {
        Proprietaire proprietaire = proprietaireMapper.toEntity(request);
        proprietaire = proprietaireRepository.save(proprietaire);
        return proprietaireMapper.toResponseDto(proprietaire);
    }

    @Override
    public ProprietaireResponse updateProprietaire(Long id, ProprietaireRequest request) {
        Proprietaire proprietaire = proprietaireRepository.findById(id).orElseThrow(() -> new RuntimeException("Proprietaire not found"));
        proprietaireMapper.updateEntityFromDto(request, proprietaire);
        proprietaire = proprietaireRepository.save(proprietaire);
        return proprietaireMapper.toResponseDto(proprietaire);
    }

    @Override
    public ProprietaireResponse getProprietaireById(Long id) {
        return proprietaireMapper.toResponseDto(proprietaireRepository.findById(id).orElseThrow(() -> new RuntimeException("Proprietaire not found")));
    }

    @Override
    public List<ProprietaireResponse> getAllProprietaires() {
        return proprietaireRepository.findAll().stream().map(proprietaireMapper::toResponseDto).collect(Collectors.toList());
    }

    @Override
    public void deleteProprietaire(Long id) {
        proprietaireRepository.deleteById(id);
    }
}
