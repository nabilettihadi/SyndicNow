package ma.Nabil.SyndicNow.service.impl;

import ma.Nabil.SyndicNow.dto.syndic.SyndicCreateDTO;
import ma.Nabil.SyndicNow.dto.syndic.SyndicResponseDTO;
import ma.Nabil.SyndicNow.dto.syndic.SyndicUpdateDTO;
import ma.Nabil.SyndicNow.entity.Syndic;
import ma.Nabil.SyndicNow.mapper.SyndicMapper;
import ma.Nabil.SyndicNow.repository.SyndicRepository;
import ma.Nabil.SyndicNow.service.SyndicService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SyndicServiceImpl implements SyndicService {

    @Autowired
    private SyndicRepository syndicRepository;

    @Autowired
    private SyndicMapper syndicMapper;

    @Override
    public SyndicResponseDTO createSyndic(SyndicCreateDTO dto) {
        Syndic syndic = syndicMapper.toEntity(dto);
        syndic = syndicRepository.save(syndic);
        return syndicMapper.toResponseDto(syndic);
    }

    @Override
    public SyndicResponseDTO updateSyndic(Long id, SyndicUpdateDTO dto) {
        Syndic syndic = syndicRepository.findById(id).orElseThrow(() -> new RuntimeException("Syndic not found"));
        syndicMapper.updateEntityFromDto(dto, syndic);
        syndic = syndicRepository.save(syndic);
        return syndicMapper.toResponseDto(syndic);
    }

    @Override
    public SyndicResponseDTO getSyndicById(Long id) {
        Syndic syndic = syndicRepository.findById(id).orElseThrow(() -> new RuntimeException("Syndic not found"));
        return syndicMapper.toResponseDto(syndic);
    }

    @Override
    public List<SyndicResponseDTO> getAllSyndics() {
        return syndicRepository.findAll().stream().map(syndicMapper::toResponseDto).collect(Collectors.toList());
    }

    @Override
    public void deleteSyndic(Long id) {
        syndicRepository.deleteById(id);
    }
}
