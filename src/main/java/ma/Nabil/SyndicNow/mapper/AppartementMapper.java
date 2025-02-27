package ma.Nabil.SyndicNow.mapper;

import ma.Nabil.SyndicNow.dto.appartement.AppartementCreateDTO;
import ma.Nabil.SyndicNow.dto.appartement.AppartementResponseDTO;
import ma.Nabil.SyndicNow.dto.appartement.AppartementUpdateDTO;
import ma.Nabil.SyndicNow.entity.Appartement;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;

import java.util.Set;

@Mapper(componentModel = "spring",
        uses = {ProprietaireMapper.class},
        unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface AppartementMapper {

    AppartementMapper INSTANCE = org.mapstruct.factory.Mappers.getMapper(AppartementMapper.class);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    @Mapping(target = "version", ignore = true)
    @Mapping(target = "immeuble", ignore = true)
    @Mapping(target = "proprietaire", ignore = true)
    Appartement toEntity(AppartementCreateDTO dto);

    @Mapping(target = "immeuble", ignore = true)
    @Mapping(target = "proprietaire", ignore = true)
    void updateEntityFromDto(AppartementUpdateDTO dto, @MappingTarget Appartement appartement);

    @Mapping(target = "immeubleName", source = "immeuble.nom")
    @Mapping(target = "immeubleId", source = "immeuble.id")
    AppartementResponseDTO toResponseDto(Appartement appartement);

    Set<AppartementResponseDTO> toResponseDtoSet(Set<Appartement> appartements);
}
