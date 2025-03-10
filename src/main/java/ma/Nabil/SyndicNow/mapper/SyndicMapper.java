package ma.Nabil.SyndicNow.mapper;

import ma.Nabil.SyndicNow.dto.syndic.SyndicRequest;
import ma.Nabil.SyndicNow.dto.syndic.SyndicResponse;
import ma.Nabil.SyndicNow.entity.Syndic;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;

import java.util.Set;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface SyndicMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    @Mapping(target = "immeubles", ignore = true)
    Syndic toEntity(SyndicRequest request);

    @Mapping(target = "immeubles", ignore = true)
    void updateEntityFromDto(SyndicRequest request, @MappingTarget Syndic syndic);

    SyndicResponse toResponseDto(Syndic syndic);

    Set<SyndicResponse> toResponseDtoSet(Set<Syndic> syndics);
}
