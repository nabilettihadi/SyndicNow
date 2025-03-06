package ma.Nabil.SyndicNow.mapper;

import ma.Nabil.SyndicNow.dto.immeuble.ImmeubleRequest;
import ma.Nabil.SyndicNow.dto.immeuble.ImmeubleResponse;
import ma.Nabil.SyndicNow.entity.Immeuble;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.springframework.stereotype.Component;

import java.util.Set;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
@Component
public interface ImmeubleMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "appartements", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    @Mapping(target = "syndic", ignore = true)
    Immeuble toEntity(ImmeubleRequest request);

    @Mapping(target = "appartements", ignore = true)
    @Mapping(target = "syndic", ignore = true)
    void updateEntityFromDto(ImmeubleRequest request, @MappingTarget Immeuble immeuble);

    @Mapping(target = "syndicId", source = "syndic.id")
    @Mapping(target = "syndicName", expression = "java(immeuble.getSyndic() != null ? immeuble.getSyndic().getNom() + \" \" + immeuble.getSyndic().getPrenom() : null)")
    ImmeubleResponse toResponse(Immeuble immeuble);

    default Set<ImmeubleResponse> toResponseDtoSet(Set<Immeuble> immeubles) {
        if (immeubles == null) {
            return null;
        }
        return immeubles.stream().map(this::toResponse).collect(java.util.stream.Collectors.toSet());
    }
}
