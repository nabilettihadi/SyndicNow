package ma.Nabil.SyndicNow.mapper;

import ma.Nabil.SyndicNow.dto.document.DocumentDTO;
import ma.Nabil.SyndicNow.dto.document.DocumentCreateDTO;
import ma.Nabil.SyndicNow.dto.document.DocumentUpdateDTO;
import ma.Nabil.SyndicNow.dto.document.DocumentMetadataDTO;
import ma.Nabil.SyndicNow.model.entities.Document;
import org.mapstruct.*;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE,
        imports = {Date.class, ChronoUnit.class, Path.class, Paths.class})
public interface DocumentMapper {
    
    @Mapping(target = "createurId", source = "createur.id")
    @Mapping(target = "createurNom", source = "createur.nom")
    @Mapping(target = "immeubleId", source = "immeuble.id")
    @Mapping(target = "immeubleNom", source = "immeuble.nom")
    @Mapping(target = "transactionId", source = "transaction.id")
    @Mapping(target = "transactionReference", source = "transaction.reference")
    @Mapping(target = "expiré", expression = "java(isExpiré(document))")
    @Mapping(target = "joursAvantExpiration", expression = "java(calculerJoursAvantExpiration(document))")
    DocumentDTO toDto(Document document);
    
    List<DocumentDTO> toDtoList(List<Document> documents);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "reference", expression = "java(generateReference(documentCreateDTO))")
    @Mapping(target = "dateCreation", expression = "java(new Date())")
    @Mapping(target = "statut", constant = "ACTIF")
    @Mapping(target = "dernièreModification", expression = "java(new Date())")
    @Mapping(target = "hash", expression = "java(generateFileHash(documentCreateDTO.getCheminFichier()))")
    @Mapping(target = "createur", ignore = true)
    @Mapping(target = "immeuble", ignore = true)
    @Mapping(target = "transaction", ignore = true)
    Document toEntity(DocumentCreateDTO documentCreateDTO);
    
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "dernièreModification", expression = "java(new Date())")
    @Mapping(target = "createur", ignore = true)
    @Mapping(target = "immeuble", ignore = true)
    @Mapping(target = "transaction", ignore = true)
    void updateDocumentFromDto(DocumentUpdateDTO documentUpdateDTO, @MappingTarget Document document);
    
    @Mapping(target = "expiré", expression = "java(isExpiré(document))")
    @Mapping(target = "joursAvantExpiration", expression = "java(calculerJoursAvantExpiration(document))")
    @Mapping(target = "createurNom", source = "createur.nom")
    DocumentMetadataDTO toMetadataDto(Document document);
    
    List<DocumentMetadataDTO> toMetadataDtoList(List<Document> documents);
    
    default boolean isExpiré(Document document) {
        if (document.getDateExpiration() == null) {
            return false;
        }
        return document.getDateExpiration().before(new Date());
    }
    
    default int calculerJoursAvantExpiration(Document document) {
        if (document.getDateExpiration() == null) {
            return Integer.MAX_VALUE;
        }
        if (isExpiré(document)) {
            return 0;
        }
        return (int) ChronoUnit.DAYS.between(
            new Date().toInstant(),
            document.getDateExpiration().toInstant()
        );
    }
    
    default String generateReference(DocumentCreateDTO dto) {
        return String.format("%s-%s-%d",
            dto.getType().name().substring(0, 3),
            new Date().getTime(),
            System.nanoTime() % 10000
        );
    }
    
    default String generateFileHash(String cheminFichier) {
        try {
            Path path = Paths.get(cheminFichier);
            return java.nio.file.Files.hash(path, java.security.MessageDigest.getInstance("SHA-256"))
                    .toString();
        } catch (Exception e) {
            return null;
        }
    }
}
