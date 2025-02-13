package ma.Nabil.SyndicNow.service.impl;

import lombok.RequiredArgsConstructor;
import ma.Nabil.SyndicNow.dto.syndic.SyndicCreateDTO;
import ma.Nabil.SyndicNow.dto.syndic.SyndicDTO;
import ma.Nabil.SyndicNow.dto.syndic.SyndicUpdateDTO;
import ma.Nabil.SyndicNow.mapper.SyndicMapper;
import ma.Nabil.SyndicNow.model.entities.Syndic;
import ma.Nabil.SyndicNow.repository.SyndicRepository;
import ma.Nabil.SyndicNow.service.SyndicService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityNotFoundException;

@Service
@RequiredArgsConstructor
@Transactional
public class SyndicServiceImpl implements SyndicService {

    private final SyndicRepository syndicRepository;
    private final SyndicMapper syndicMapper;

    @Override
    public SyndicDTO createSyndic(SyndicCreateDTO createDTO) {
        Syndic syndic = syndicMapper.toEntity(createDTO);
        syndic = syndicRepository.save(syndic);
        return syndicMapper.toDto(syndic);
    }

    @Override
    public SyndicDTO updateSyndic(Long id, SyndicUpdateDTO updateDTO) {
        Syndic existingSyndic = syndicRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Syndic not found with id: " + id));
        
        syndicMapper.updateEntity(updateDTO, existingSyndic);
        existingSyndic = syndicRepository.save(existingSyndic);
        return syndicMapper.toDto(existingSyndic);
    }

    @Override
    @Transactional(readOnly = true)
    public SyndicDTO getSyndicById(Long id) {
        return syndicRepository.findById(id)
                .map(syndicMapper::toDto)
                .orElseThrow(() -> new EntityNotFoundException("Syndic not found with id: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<SyndicDTO> getAllSyndics(Pageable pageable) {
        return syndicRepository.findAll(pageable)
                .map(syndicMapper::toDto);
    }

    @Override
    public void deleteSyndic(Long id) {
        if (!syndicRepository.existsById(id)) {
            throw new EntityNotFoundException("Syndic not found with id: " + id);
        }
        syndicRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsById(Long id) {
        return syndicRepository.existsById(id);
    }
}
