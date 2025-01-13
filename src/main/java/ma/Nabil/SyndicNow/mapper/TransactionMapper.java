package ma.Nabil.SyndicNow.mapper;

import ma.Nabil.SyndicNow.dto.TransactionDTO;
import ma.Nabil.SyndicNow.dto.TransactionCreateDTO;
import ma.Nabil.SyndicNow.dto.TransactionUpdateDTO;
import ma.Nabil.SyndicNow.dto.TransactionPaiementDTO;
import ma.Nabil.SyndicNow.model.entities.Transaction;
import ma.Nabil.SyndicNow.model.enums.StatutTransaction;
import org.mapstruct.*;

import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE,
        imports = {Date.class, ChronoUnit.class})
public interface TransactionMapper {
    
    @Mapping(target = "appartementId", source = "appartement.id")
    @Mapping(target = "appartementNumero", source = "appartement.numero")
    @Mapping(target = "immeubleName", source = "appartement.immeuble.nom")
    @Mapping(target = "proprietaireName", source = "appartement.proprietaire.nom")
    @Mapping(target = "budgetId", source = "budget.id")
    @Mapping(target = "documentId", source = "document.id")
    @Mapping(target = "documentReference", source = "document.reference")
    @Mapping(target = "enRetard", expression = "java(isEnRetard(transaction))")
    @Mapping(target = "joursRetard", expression = "java(calculerJoursRetard(transaction))")
    TransactionDTO toDto(Transaction transaction);
    
    List<TransactionDTO> toDtoList(List<Transaction> transactions);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "reference", expression = "java(generateReference(transactionCreateDTO))")
    @Mapping(target = "dateTransaction", expression = "java(new Date())")
    @Mapping(target = "statut", constant = "EN_ATTENTE")
    @Mapping(target = "appartement", ignore = true)
    @Mapping(target = "budget", ignore = true)
    @Mapping(target = "document", ignore = true)
    Transaction toEntity(TransactionCreateDTO transactionCreateDTO);
    
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "appartement", ignore = true)
    @Mapping(target = "budget", ignore = true)
    @Mapping(target = "document", ignore = true)
    void updateTransactionFromDto(TransactionUpdateDTO transactionUpdateDTO, @MappingTarget Transaction transaction);
    
    @Mapping(target = "statut", constant = "PAYEE")
    @Mapping(target = "appartement", ignore = true)
    @Mapping(target = "budget", ignore = true)
    @Mapping(target = "document", ignore = true)
    void applyPaiement(TransactionPaiementDTO paiementDTO, @MappingTarget Transaction transaction);
    
    default boolean isEnRetard(Transaction transaction) {
        if (transaction.getStatut() == StatutTransaction.PAYEE) {
            return false;
        }
        return transaction.getDateEcheance() != null && 
               transaction.getDateEcheance().before(new Date());
    }
    
    default int calculerJoursRetard(Transaction transaction) {
        if (!isEnRetard(transaction) || transaction.getDateEcheance() == null) {
            return 0;
        }
        return (int) ChronoUnit.DAYS.between(
            transaction.getDateEcheance().toInstant(),
            new Date().toInstant()
        );
    }
    
    default String generateReference(TransactionCreateDTO dto) {
        return String.format("%s-%s-%d",
            dto.getType().name().substring(0, 3),
            new Date().getTime(),
            dto.getAppartementId()
        );
    }
}
