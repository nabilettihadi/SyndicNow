package ma.Nabil.SyndicNow.service.impl;

import ma.Nabil.SyndicNow.dto.immeuble.ImmeubleRequest;
import ma.Nabil.SyndicNow.dto.immeuble.ImmeubleResponse;
import ma.Nabil.SyndicNow.entity.Immeuble;
import ma.Nabil.SyndicNow.mapper.ImmeubleMapper;
import ma.Nabil.SyndicNow.repository.ImmeubleRepository;
import ma.Nabil.SyndicNow.service.ImmeubleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ImmeubleServiceImpl implements ImmeubleService {

    @Autowired
    private ImmeubleRepository immeubleRepository;

    @Autowired
    private ImmeubleMapper immeubleMapper;

    @Override
    public ImmeubleResponse createImmeuble(ImmeubleRequest dto) {
        Immeuble immeuble = immeubleMapper.toEntity(dto);
        immeuble = immeubleRepository.save(immeuble);
        return immeubleMapper.toResponseDto(immeuble);
    }

    @Override
    public ImmeubleResponse updateImmeuble(Long id, ImmeubleRequest dto) {
        Immeuble immeuble = immeubleRepository.findById(id).orElseThrow(() -> new RuntimeException("Immeuble not found"));
        immeubleMapper.updateEntityFromDto(dto, immeuble);
        immeuble = immeubleRepository.save(immeuble);
        return immeubleMapper.toResponseDto(immeuble);
    }

    @Override
    public ImmeubleResponse getImmeubleById(Long id) {
        Immeuble immeuble = immeubleRepository.findById(id).orElseThrow(() -> new RuntimeException("Immeuble not found"));
        return immeubleMapper.toResponseDto(immeuble);
    }

    @Override
    public List<ImmeubleResponse> getAllImmeubles() {
        return immeubleRepository.findAll().stream().map(immeubleMapper::toResponseDto).collect(Collectors.toList());
    }

    @Override
    public void deleteImmeuble(Long id) {
        immeubleRepository.deleteById(id);
    }
}
