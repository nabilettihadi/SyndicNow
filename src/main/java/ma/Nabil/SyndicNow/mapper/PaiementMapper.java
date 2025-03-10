package ma.Nabil.SyndicNow.mapper;

import ma.Nabil.SyndicNow.dto.paiement.PaiementRequest;
import ma.Nabil.SyndicNow.dto.paiement.PaiementResponse;
import ma.Nabil.SyndicNow.entity.Paiement;
import ma.Nabil.SyndicNow.entity.Proprietaire;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import java.util.Set;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface PaiementMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "datePaiement", ignore = true)
    @Mapping(target = "appartement", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    @Mapping(target = "status", constant = "EN_ATTENTE")
    Paiement toPaiement(PaiementRequest request);

    @Mapping(target = "appartementId", source = "appartement.id")
    @Mapping(target = "appartementNumero", source = "appartement.numero")
    @Mapping(target = "proprietaireId", expression = "java(getFirstProprietaireId(paiement))")
    @Mapping(target = "proprietaireName", expression = "java(getFirstProprietaireName(paiement))")
    PaiementResponse toPaiementResponse(Paiement paiement);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "datePaiement", ignore = true)
    @Mapping(target = "appartement", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    void updatePaiementFromRequest(PaiementRequest request, @MappingTarget Paiement paiement);

    default Long getFirstProprietaireId(Paiement paiement) {
        Set<Proprietaire> proprietaires = paiement.getAppartement().getProprietaires();
        return proprietaires.isEmpty() ? null : proprietaires.iterator().next().getId();
    }

    default String getFirstProprietaireName(Paiement paiement) {
        Set<Proprietaire> proprietaires = paiement.getAppartement().getProprietaires();
        return proprietaires.isEmpty() ? null : proprietaires.iterator().next().getNom();
    }
}
