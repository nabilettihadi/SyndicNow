package ma.Nabil.SyndicNow.domain.mapper;

import ma.Nabil.SyndicNow.domain.dto.paiement.PaiementCreateDTO;
import ma.Nabil.SyndicNow.domain.dto.paiement.PaiementResponseDTO;
import ma.Nabil.SyndicNow.domain.dto.paiement.PaiementUpdateDTO;
import ma.Nabil.SyndicNow.domain.entity.Paiement;
import org.mapstruct.*;

@Mapper(componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface PaiementMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    @Mapping(target = "version", ignore = true)
    @Mapping(target = "appartement", ignore = true)
    @Mapping(target = "reference", expression = "java(generateReference())")
    @Mapping(target = "statut", constant = "EN_ATTENTE")
    Paiement toEntity(PaiementCreateDTO dto);

    @Mapping(target = "appartement", ignore = true)
    void updateEntityFromDto(PaiementUpdateDTO dto, @MappingTarget Paiement paiement);

    @Mapping(target = "appartementId", source = "appartement.id")
    @Mapping(target = "appartementNumero", source = "appartement.numero")
    @Mapping(target = "proprietaireNom", source = "appartement.proprietaire.nom")
    @Mapping(target = "proprietairePrenom", source = "appartement.proprietaire.prenom")
    @Mapping(target = "immeubleNom", source = "appartement.immeuble.nom")
    PaiementResponseDTO toResponseDto(Paiement paiement);

    @Named("generateReference")
    default String generateReference() {
        return "PAY-" + System.currentTimeMillis();
    }
}
