package ma.Nabil.SyndicNow.mapper;

import ma.Nabil.SyndicNow.dto.immeuble.ImmeubleCreateDTO;
import ma.Nabil.SyndicNow.dto.immeuble.ImmeubleResponseDTO;
import ma.Nabil.SyndicNow.dto.immeuble.ImmeubleUpdateDTO;
import ma.Nabil.SyndicNow.entity.Immeuble;
import org.mapstruct.*;

import java.util.Set;

@Mapper(componentModel = "spring",
        uses = {AppartementMapper.class},
        unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ImmeubleMapper {

    ImmeubleMapper INSTANCE = org.mapstruct.factory.Mappers.getMapper(ImmeubleMapper.class);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    @Mapping(target = "version", ignore = true)
    @Mapping(target = "syndic", ignore = true)
    @Mapping(target = "appartements", ignore = true)
    Immeuble toEntity(ImmeubleCreateDTO dto);

    @Mapping(target = "syndic", ignore = true)
    @Mapping(target = "appartements", ignore = true)
    void updateEntityFromDto(ImmeubleUpdateDTO dto, @MappingTarget Immeuble immeuble);

    @Mapping(target = "syndic", ignore = true)
    ImmeubleResponseDTO toResponseDto(Immeuble immeuble);

    Set<ImmeubleResponseDTO> toResponseDtoSet(Set<Immeuble> immeubles);

    @AfterMapping
    default void setAppartements(@MappingTarget ImmeubleResponseDTO dto, Immeuble immeuble) {
        if (immeuble.getAppartements() != null && !immeuble.getAppartements().isEmpty()) {
            dto.setAppartements(AppartementMapper.INSTANCE.toResponseDtoSet(immeuble.getAppartements()));
        }
    }
}
