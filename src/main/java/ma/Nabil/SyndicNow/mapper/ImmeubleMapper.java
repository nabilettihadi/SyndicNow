package ma.Nabil.SyndicNow.mapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.Nabil.SyndicNow.dto.immeuble.ImmeubleRequest;
import ma.Nabil.SyndicNow.dto.immeuble.ImmeubleResponse;
import ma.Nabil.SyndicNow.dto.syndic.SyndicResponse;
import ma.Nabil.SyndicNow.entity.Immeuble;
import ma.Nabil.SyndicNow.entity.Syndic;
import ma.Nabil.SyndicNow.exception.ResourceNotFoundException;
import ma.Nabil.SyndicNow.repository.SyndicRepository;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class ImmeubleMapper {

    private final SyndicRepository syndicRepository;

    public ImmeubleResponse toResponse(Immeuble immeuble) {
        if (immeuble == null) {
            throw new IllegalArgumentException("L'immeuble ne peut pas être null");
        }

        Syndic syndic = immeuble.getSyndic();
        if (syndic == null) {
            throw new IllegalStateException("Le syndic ne peut pas être null pour l'immeuble: " + immeuble.getId());
        }

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
                .syndicId(syndic.getId())
                .syndic(SyndicResponse.builder()
                        .id(syndic.getId())
                        .nom(syndic.getNom())
                        .email(syndic.getEmail())
                        .build())
                .dateCreation(immeuble.getCreatedAt())
                .dateModification(immeuble.getUpdatedAt())
                .build();
    }

    public Immeuble toEntity(ImmeubleRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("La requête ne peut pas être null");
        }

        log.debug("Création d'un nouvel immeuble avec la requête: {}", request);

        Syndic syndic = getSyndicById(request.getSyndicId());
        validateSyndic(syndic);

        Immeuble immeuble = new Immeuble();
        updateEntityFromRequest(request, immeuble, syndic);
        return immeuble;
    }

    public void updateEntityFromRequest(ImmeubleRequest request, Immeuble immeuble) {
        if (request == null || immeuble == null) {
            throw new IllegalArgumentException("La requête et l'immeuble ne peuvent pas être null");
        }

        log.debug("Mise à jour de l'immeuble {} avec la requête: {}", immeuble.getId(), request);

        Syndic syndic = getSyndicById(request.getSyndicId());
        validateSyndic(syndic);

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

    private Syndic getSyndicById(Long syndicId) {
        return syndicRepository.findById(syndicId)
                .orElseThrow(() -> new ResourceNotFoundException("Syndic non trouvé avec l'ID: " + syndicId));
    }

    private void validateSyndic(Syndic syndic) {
        if (syndic == null) {
            throw new IllegalStateException("Le syndic ne peut pas être null");
        }
        // Ajoutez d'autres validations si nécessaire (par exemple, vérifier le statut du syndic)
    }
}
