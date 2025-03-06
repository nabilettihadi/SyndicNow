package ma.Nabil.SyndicNow.mapper;

import ma.Nabil.SyndicNow.dto.paiement.PaiementRequest;
import ma.Nabil.SyndicNow.dto.paiement.PaiementResponse;
import ma.Nabil.SyndicNow.entity.Paiement;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface PaiementMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "datePaiement", ignore = true)
    @Mapping(target = "appartement", ignore = true)
    @Mapping(target = "status", constant = "EN_ATTENTE")
    Paiement toPaiement(PaiementRequest request);

    @Mapping(target = "appartementId", source = "appartement.id")
    @Mapping(target = "appartementNumero", source = "appartement.numero")
    @Mapping(target = "proprietaireId", source = "appartement.proprietaire.id")
    @Mapping(target = "proprietaireName", source = "appartement.proprietaire.nom")
    PaiementResponse toPaiementResponse(Paiement paiement);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "datePaiement", ignore = true)
    @Mapping(target = "appartement", ignore = true)
    void updatePaiementFromRequest(PaiementRequest request, @MappingTarget Paiement paiement);
}
