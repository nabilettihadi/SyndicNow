package ma.Nabil.SyndicNow.mapper;

import ma.Nabil.SyndicNow.dto.notification.NotificationDTO;
import ma.Nabil.SyndicNow.dto.notification.NotificationCreateDTO;
import ma.Nabil.SyndicNow.dto.notification.NotificationUpdateDTO;
import ma.Nabil.SyndicNow.dto.notification.NotificationBatchDTO;
import ma.Nabil.SyndicNow.model.entities.Notification;
import org.mapstruct.*;

import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE,
        imports = {Date.class, ChronoUnit.class})
public interface NotificationMapper {
    
    @Mapping(target = "destinataireId", source = "destinataire.id")
    @Mapping(target = "destinataireNom", expression = "java(getDestinataireName(notification))")
    @Mapping(target = "destinataireType", expression = "java(getDestinataireType(notification))")
    @Mapping(target = "immeubleId", source = "immeuble.id")
    @Mapping(target = "immeubleNom", source = "immeuble.nom")
    @Mapping(target = "expiree", expression = "java(isExpiree(notification))")
    @Mapping(target = "joursAvantExpiration", expression = "java(calculerJoursAvantExpiration(notification))")
    NotificationDTO toDto(Notification notification);
    
    List<NotificationDTO> toDtoList(List<Notification> notifications);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "dateCreation", expression = "java(new Date())")
    @Mapping(target = "vue", constant = "false")
    @Mapping(target = "destinataire", ignore = true)
    @Mapping(target = "immeuble", ignore = true)
    Notification toEntity(NotificationCreateDTO notificationCreateDTO);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "dateCreation", expression = "java(new Date())")
    @Mapping(target = "vue", constant = "false")
    @Mapping(target = "destinataire", ignore = true)
    @Mapping(target = "immeuble", ignore = true)
    Notification batchToEntity(NotificationBatchDTO batchDTO);
    
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "destinataire", ignore = true)
    @Mapping(target = "immeuble", ignore = true)
    void updateNotificationFromDto(NotificationUpdateDTO updateDTO, @MappingTarget Notification notification);
    
    default String getDestinataireName(Notification notification) {
        if (notification.getDestinataire() == null) return null;
        return notification.getDestinataire().getNom();
    }
    
    default String getDestinataireType(Notification notification) {
        if (notification.getDestinataire() == null) return null;
        return notification.getDestinataire().getClass().getSimpleName();
    }
    
    default boolean isExpiree(Notification notification) {
        if (notification.getDateExpiration() == null) {
            return false;
        }
        return notification.getDateExpiration().before(new Date());
    }
    
    default int calculerJoursAvantExpiration(Notification notification) {
        if (notification.getDateExpiration() == null) {
            return Integer.MAX_VALUE;
        }
        if (isExpiree(notification)) {
            return 0;
        }
        return (int) ChronoUnit.DAYS.between(
            new Date().toInstant(),
            notification.getDateExpiration().toInstant()
        );
    }
    
    @AfterMapping
    default void handleDateLecture(@MappingTarget Notification notification) {
        if (notification.isVue() && notification.getDateLecture() == null) {
            notification.setDateLecture(new Date());
        }
    }
}
