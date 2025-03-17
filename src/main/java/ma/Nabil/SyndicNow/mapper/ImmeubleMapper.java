package ma.Nabil.SyndicNow.mapper;

import lombok.RequiredArgsConstructor;
import ma.Nabil.SyndicNow.dto.immeuble.ImmeubleRequest;
import ma.Nabil.SyndicNow.dto.immeuble.ImmeubleResponse;
import ma.Nabil.SyndicNow.entity.Immeuble;
import ma.Nabil.SyndicNow.entity.Syndic;
import ma.Nabil.SyndicNow.exception.ResourceNotFoundException;
import ma.Nabil.SyndicNow.repository.SyndicRepository;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ImmeubleMapper {

    private final SyndicRepository syndicRepository;

    public ImmeubleResponse toResponse(Immeuble immeuble) {
        return ImmeubleResponse.builder()
                .id(immeuble.getId())
                .nom(immeuble.getNom())
                .adresse(immeuble.getAdresse())
                .ville(immeuble.getVille())
                .codePostal(immeuble.getCodePostal())
                .nombreEtages(immeuble.getNombreEtages())
                .nombreAppartements(immeuble.getNombreAppartements())
                .anneeConstruction(immeuble.getAnneeConstruction())
                .description(immeuble.getDescription())
                .syndicId(immeuble.getSyndic().getId())
                .dateCreation(immeuble.getDateCreation())
                .dateModification(immeuble.getDateModification())
                .build();
    }

    public Immeuble toEntity(ImmeubleRequest request) {
        Syndic syndic = syndicRepository.findById(request.getSyndicId())
                .orElseThrow(() -> new ResourceNotFoundException("Syndic non trouvé avec l'ID: " + request.getSyndicId()));

        Immeuble immeuble = new Immeuble();
        updateEntityFromRequest(request, immeuble, syndic);
        return immeuble;
    }

    public void updateEntityFromRequest(ImmeubleRequest request, Immeuble immeuble) {
        Syndic syndic = syndicRepository.findById(request.getSyndicId())
                .orElseThrow(() -> new ResourceNotFoundException("Syndic non trouvé avec l'ID: " + request.getSyndicId()));
        updateEntityFromRequest(request, immeuble, syndic);
    }

    private void updateEntityFromRequest(ImmeubleRequest request, Immeuble immeuble, Syndic syndic) {
        immeuble.setNom(request.getNom());
        immeuble.setAdresse(request.getAdresse());
        immeuble.setVille(request.getVille());
        immeuble.setCodePostal(request.getCodePostal());
        immeuble.setNombreEtages(request.getNombreEtages());
        immeuble.setNombreAppartements(request.getNombreAppartements());
        immeuble.setAnneeConstruction(request.getAnneeConstruction());
        immeuble.setDescription(request.getDescription());
        immeuble.setSyndic(syndic);
    }
}
