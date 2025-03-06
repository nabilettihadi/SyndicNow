package ma.Nabil.SyndicNow.service.impl;

import lombok.RequiredArgsConstructor;
import ma.Nabil.SyndicNow.dto.syndic.SyndicRequest;
import ma.Nabil.SyndicNow.dto.syndic.SyndicResponse;
import ma.Nabil.SyndicNow.entity.Immeuble;
import ma.Nabil.SyndicNow.entity.Syndic;
import ma.Nabil.SyndicNow.enums.Role;
import ma.Nabil.SyndicNow.exception.ResourceNotFoundException;
import ma.Nabil.SyndicNow.repository.SyndicRepository;
import ma.Nabil.SyndicNow.service.SyndicService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SyndicServiceImpl implements SyndicService {

    private final SyndicRepository syndicRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public SyndicResponse createSyndic(SyndicRequest request) {
        Syndic syndic = Syndic.builder().nom(request.getNom()).prenom(request.getPrenom()).email(request.getEmail()).password(passwordEncoder.encode(request.getPassword())).telephone(request.getTelephone()).adresse(request.getAdresse()).entreprise(request.getSociete()).numeroLicence(request.getNumeroLicence()).role(Role.SYNDIC).build();

        syndic = syndicRepository.save(syndic);
        return mapToResponse(syndic);
    }

    @Override
    @Transactional
    public SyndicResponse updateSyndic(Long id, SyndicRequest request) {
        Syndic syndic = syndicRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Syndic non trouvé avec l'ID: " + id));

        syndic.setNom(request.getNom());
        syndic.setPrenom(request.getPrenom());
        syndic.setEmail(request.getEmail());
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            syndic.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        syndic.setTelephone(request.getTelephone());
        syndic.setAdresse(request.getAdresse());
        syndic.setEntreprise(request.getSociete());
        syndic.setNumeroLicence(request.getNumeroLicence());

        syndic = syndicRepository.save(syndic);
        return mapToResponse(syndic);
    }

    @Override
    @Transactional(readOnly = true)
    public SyndicResponse getSyndicById(Long id) {
        Syndic syndic = syndicRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Syndic non trouvé avec l'ID: " + id));
        return mapToResponse(syndic);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SyndicResponse> getAllSyndics() {
        return syndicRepository.findAll().stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteSyndic(Long id) {
        if (!syndicRepository.existsById(id)) {
            throw new ResourceNotFoundException("Syndic non trouvé avec l'ID: " + id);
        }
        syndicRepository.deleteById(id);
    }

    private SyndicResponse mapToResponse(Syndic syndic) {
        List<Long> immeubleIds = syndic.getImmeubles() != null ? syndic.getImmeubles().stream().map(Immeuble::getId).collect(Collectors.toList()) : List.of();

        return SyndicResponse.builder().id(syndic.getId()).nom(syndic.getNom()).prenom(syndic.getPrenom()).email(syndic.getEmail()).telephone(syndic.getTelephone()).adresse(syndic.getAdresse()).entreprise(syndic.getEntreprise()).numeroLicence(syndic.getNumeroLicence()).role(syndic.getRole().toString()).createdAt(syndic.getCreatedAt()).updatedAt(syndic.getUpdatedAt()).immeubleIds(immeubleIds).build();
    }
}
