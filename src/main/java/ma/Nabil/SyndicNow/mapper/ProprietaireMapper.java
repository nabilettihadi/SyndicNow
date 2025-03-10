package ma.Nabil.SyndicNow.mapper;

import ma.Nabil.SyndicNow.dto.proprietaire.ProprietaireRequest;
import ma.Nabil.SyndicNow.dto.proprietaire.ProprietaireResponse;
import ma.Nabil.SyndicNow.entity.Proprietaire;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;
import org.springframework.stereotype.Component;

import java.util.Set;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE, unmappedTargetPolicy = ReportingPolicy.IGNORE)
@Component
public interface ProprietaireMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "appartements", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    Proprietaire toEntity(ProprietaireRequest request);

    @Mapping(target = "appartements", ignore = true)
    void updateEntityFromDto(ProprietaireRequest request, @MappingTarget Proprietaire proprietaire);

    ProprietaireResponse toResponseDto(Proprietaire proprietaire);

    Set<ProprietaireResponse> toResponseDtoSet(Set<Proprietaire> proprietaires);
}
