package ma.Nabil.SyndicNow.mapper;

import ma.Nabil.SyndicNow.dto.AppartementDTO;
import ma.Nabil.SyndicNow.dto.AppartementCreateDTO;
import ma.Nabil.SyndicNow.dto.AppartementUpdateDTO;
import ma.Nabil.SyndicNow.model.entities.Appartement;
import ma.Nabil.SyndicNow.model.entities.Transaction;
import ma.Nabil.SyndicNow.model.enums.StatutTransaction;
import ma.Nabil.SyndicNow.model.enums.TypeTransaction;
import org.mapstruct.*;

import java.util.Comparator;
import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE, 
        uses = {ImmeubleMapper.class, CopropriétaireMapper.class})
public interface AppartementMapper {
    
    @Mapping(target = "immeubleId", source = "immeuble.id")
    @Mapping(target = "immeubleNom", source = "immeuble.nom")
    @Mapping(target = "proprietaireId", source = "proprietaire.id")
    @Mapping(target = "proprietaireNom", source = "proprietaire.nom")
    @Mapping(target = "nombreIncidents", expression = "java(appartement.getIncidents().size())")
    @Mapping(target = "totalCotisations", expression = "java(calculerTotalCotisations(appartement))")
    @Mapping(target = "cotisationsImpayees", expression = "java(calculerCotisationsImpayees(appartement))")
    @Mapping(target = "aJour", expression = "java(estAJour(appartement))")
    @Mapping(target = "dernierPaiement", expression = "java(getDernierPaiement(appartement))")
    @Mapping(target = "solde", expression = "java(calculerSolde(appartement))")
    AppartementDTO toDto(Appartement appartement);
    
    List<AppartementDTO> toDtoList(List<Appartement> appartements);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "dateAjout", expression = "java(new java.util.Date())")
    @Mapping(target = "incidents", ignore = true)
    @Mapping(target = "transactions", ignore = true)
    @Mapping(target = "dateDernierReleve", expression = "java(new java.util.Date())")
    Appartement toEntity(AppartementCreateDTO appartementCreateDTO);
    
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "incidents", ignore = true)
    @Mapping(target = "transactions", ignore = true)
    void updateAppartementFromDto(AppartementUpdateDTO appartementUpdateDTO, @MappingTarget Appartement appartement);
    
    default double calculerTotalCotisations(Appartement appartement) {
        if (appartement.getTransactions() == null) return 0.0;
        return appartement.getTransactions().stream()
                .filter(t -> t.getType() == TypeTransaction.COTISATION)
                .mapToDouble(Transaction::getMontant)
                .sum();
    }
    
    default double calculerCotisationsImpayees(Appartement appartement) {
        if (appartement.getTransactions() == null) return 0.0;
        return appartement.getTransactions().stream()
                .filter(t -> t.getType() == TypeTransaction.COTISATION 
                        && t.getStatut() == StatutTransaction.EN_ATTENTE)
                .mapToDouble(Transaction::getMontant)
                .sum();
    }
    
    default boolean estAJour(Appartement appartement) {
        return calculerCotisationsImpayees(appartement) == 0.0;
    }
    
    default Date getDernierPaiement(Appartement appartement) {
        if (appartement.getTransactions() == null || appartement.getTransactions().isEmpty()) {
            return null;
        }
        return appartement.getTransactions().stream()
                .filter(t -> t.getType() == TypeTransaction.COTISATION 
                        && t.getStatut() == StatutTransaction.PAYEE)
                .max(Comparator.comparing(Transaction::getDateTransaction))
                .map(Transaction::getDateTransaction)
                .orElse(null);
    }
    
    default double calculerSolde(Appartement appartement) {
        if (appartement.getTransactions() == null) return 0.0;
        double totalCotisations = appartement.getTransactions().stream()
                .filter(t -> t.getType() == TypeTransaction.COTISATION)
                .mapToDouble(Transaction::getMontant)
                .sum();
        double totalPaiements = appartement.getTransactions().stream()
                .filter(t -> t.getType() == TypeTransaction.COTISATION 
                        && t.getStatut() == StatutTransaction.PAYEE)
                .mapToDouble(Transaction::getMontant)
                .sum();
        return totalPaiements - totalCotisations;
    }
}
