package ma.Nabil.SyndicNow.service.impl;

import ma.Nabil.SyndicNow.dto.proprietaire.ProprietaireRequest;
import ma.Nabil.SyndicNow.dto.proprietaire.ProprietaireResponse;
import ma.Nabil.SyndicNow.entity.Proprietaire;
import ma.Nabil.SyndicNow.mapper.ProprietaireMapper;
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
    public ProprietaireResponse createProprietaire(ProprietaireRequest dto) {
        Proprietaire proprietaire = proprietaireMapper.toEntity(dto);
        proprietaire = proprietaireRepository.save(proprietaire);
        return proprietaireMapper.toResponse(proprietaire);
    }

    @Override
    public ProprietaireResponse updateProprietaire(Long id, ProprietaireRequest dto) {
        Proprietaire proprietaire = proprietaireRepository.findById(id).orElseThrow(() -> new RuntimeException("Proprietaire not found"));
        proprietaireMapper.updateEntityFromDto(dto, proprietaire);
        proprietaire = proprietaireRepository.save(proprietaire);
        return proprietaireMapper.toResponse(proprietaire);
    }

    @Override
    public ProprietaireResponse getProprietaireById(Long id) {
        Proprietaire proprietaire = proprietaireRepository.findById(id).orElseThrow(() -> new RuntimeException("Proprietaire not found"));
        return proprietaireMapper.toResponse(proprietaire);
    }

    @Override
    public List<ProprietaireResponse> getAllProprietaires() {
        return proprietaireRepository.findAll().stream().map(proprietaireMapper::toResponse).collect(Collectors.toList());
    }

    @Override
    public void deleteProprietaire(Long id) {
        proprietaireRepository.deleteById(id);
    }
}
