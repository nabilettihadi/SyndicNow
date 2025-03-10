package ma.Nabil.SyndicNow.mapper;

import ma.Nabil.SyndicNow.dto.immeuble.ImmeubleRequest;
import ma.Nabil.SyndicNow.dto.immeuble.ImmeubleResponse;
import ma.Nabil.SyndicNow.entity.Immeuble;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;
import org.springframework.stereotype.Component;

import java.util.Set;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE, unmappedTargetPolicy = ReportingPolicy.IGNORE)
@Component
public interface ImmeubleMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "appartements", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    @Mapping(target = "syndic", ignore = true)
    @Mapping(target = "ville", source = "ville")
    @Mapping(target = "description", source = "description")
    Immeuble toEntity(ImmeubleRequest request);

    @Mapping(target = "appartements", ignore = true)
    @Mapping(target = "syndic", ignore = true)
    @Mapping(target = "ville", source = "ville")
    @Mapping(target = "description", source = "description")
    void updateEntityFromDto(ImmeubleRequest request, @MappingTarget Immeuble immeuble);

    @Mapping(target = "syndicName", source = "syndic.nom")
    @Mapping(target = "syndicId", source = "syndic.id")
    ImmeubleResponse toResponseDto(Immeuble immeuble);

    default Set<ImmeubleResponse> toResponseDtoSet(Set<Immeuble> immeubles) {
        if (immeubles == null) {
            return null;
        }
        return immeubles.stream().map(this::toResponseDto).collect(java.util.stream.Collectors.toSet());
    }
}
