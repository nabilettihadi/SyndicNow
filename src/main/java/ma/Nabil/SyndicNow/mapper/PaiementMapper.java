package ma.Nabil.SyndicNow.mapper;

import ma.Nabil.SyndicNow.dto.paiement.PaiementRequest;
import ma.Nabil.SyndicNow.dto.paiement.PaiementResponse;
import ma.Nabil.SyndicNow.dto.paiement.PaiementDTO;
import ma.Nabil.SyndicNow.entity.Paiement;
import org.mapstruct.*;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
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
    @Mapping(target = "proprietaireId", source = "appartement.proprietaire.id")
    @Mapping(target = "proprietaireName", source = "appartement.proprietaire.nom")
    PaiementResponse toPaiementResponse(Paiement paiement);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "datePaiement", ignore = true)
    @Mapping(target = "appartement", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    void updatePaiementFromRequest(PaiementRequest request, @MappingTarget Paiement paiement);

    @Mapping(target = "proprietaire", source = "appartement.proprietaire")
    @Mapping(target = "appartementId", source = "appartement.id")
    PaiementDTO toDto(Paiement paiement);

    @Mapping(target = "appartement.proprietaire", source = "proprietaire")
    @Mapping(target = "appartement.id", source = "appartementId")
    Paiement toEntity(PaiementDTO paiementDTO);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updatePaiementFromDto(PaiementDTO paiementDTO, @MappingTarget Paiement paiement);
}
