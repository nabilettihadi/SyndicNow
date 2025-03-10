package ma.Nabil.SyndicNow.mapper;

import ma.Nabil.SyndicNow.dto.appartement.AppartementRequest;
import ma.Nabil.SyndicNow.dto.appartement.AppartementResponse;
import ma.Nabil.SyndicNow.entity.Appartement;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;

import java.util.Set;

@Mapper(componentModel = "spring", uses = {ProprietaireMapper.class}, unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface AppartementMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    @Mapping(target = "immeuble", ignore = true)
    @Mapping(target = "proprietaire", ignore = true)
    Appartement toEntity(AppartementRequest dto);

    @Mapping(target = "immeuble", ignore = true)
    @Mapping(target = "proprietaire", ignore = true)
    void updateEntityFromDto(AppartementRequest dto, @MappingTarget Appartement appartement);

    @Mapping(target = "immeubleName", source = "immeuble.nom")
    @Mapping(target = "immeubleId", source = "immeuble.id")
    AppartementResponse toResponseDto(Appartement appartement);

    Set<AppartementResponse> toResponseDtoSet(Set<Appartement> appartements);
}
