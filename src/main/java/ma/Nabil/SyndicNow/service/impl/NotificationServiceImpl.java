package ma.Nabil.SyndicNow.service.impl;

import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.Nabil.SyndicNow.config.TwilioConfig;
import ma.Nabil.SyndicNow.entity.Paiement;
import ma.Nabil.SyndicNow.entity.User;
import ma.Nabil.SyndicNow.service.NotificationService;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationServiceImpl implements NotificationService {
    private final JavaMailSender emailSender;
    private final TwilioConfig twilioConfig;

    @Override
    @Async
    public void sendEmailNotification(String email, String subject, String content) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(email);
            message.setSubject(subject);
            message.setText(content);
            emailSender.send(message);
            log.info("Email notification sent to {}: {}", email, subject);
        } catch (Exception e) {
            log.error("Failed to send email notification to {}: {}", email, e.getMessage());
        }
    }

    @Override
    public void sendSmsNotification(User user, String content) {
        try {
            Message.creator(
                new PhoneNumber(user.getTelephone()),
                new PhoneNumber(twilioConfig.getPhoneNumber()),
                content
            ).create();
            log.info("SMS sent successfully to {}", user.getTelephone());
        } catch (Exception e) {
            log.error("Failed to send SMS to {}: {}", user.getTelephone(), e.getMessage());
            throw new RuntimeException("Failed to send SMS notification", e);
        }
    }

    @Override
    @Async
    public void notifyPaymentCreated(Paiement paiement) {
        paiement.getAppartement().getProprietaires().forEach(proprietaire -> {
            String subject = "Nouveau paiement créé";
            String content = String.format(
                "Un nouveau paiement a été créé pour votre appartement %s.\n" +
                "Montant: %.2f DH\n" +
                "Date d'échéance: %s\n" +
                "Type: %s\n" +
                "Référence: %s",
                paiement.getAppartement().getNumero(),
                paiement.getMontant(),
                paiement.getDateEcheance(),
                paiement.getType(),
                paiement.getReference()
            );
            sendEmailNotification(proprietaire.getEmail(), subject, content);
        });
    }

    @Override
    @Async
    public void notifyPaymentDue(Paiement paiement) {
        paiement.getAppartement().getProprietaires().forEach(proprietaire -> {
            String subject = "Rappel de paiement";
            String content = String.format(
                "Un paiement arrive à échéance pour votre appartement %s.\n" +
                "Montant: %.2f DH\n" +
                "Date d'échéance: %s\n" +
                "Type: %s\n" +
                "Référence: %s",
                paiement.getAppartement().getNumero(),
                paiement.getMontant(),
                paiement.getDateEcheance(),
                paiement.getType(),
                paiement.getReference()
            );
            sendEmailNotification(proprietaire.getEmail(), subject, content);
        });
    }

    @Override
    @Async
    public void notifyPaymentOverdue(Paiement paiement) {
        paiement.getAppartement().getProprietaires().forEach(proprietaire -> {
            String subject = "Paiement en retard";
            String content = String.format(
                "Un paiement est en retard pour votre appartement %s.\n" +
                "Montant: %.2f DH\n" +
                "Date d'échéance: %s\n" +
                "Type: %s\n" +
                "Référence: %s\n" +
                "Veuillez régulariser votre situation dès que possible.",
                paiement.getAppartement().getNumero(),
                paiement.getMontant(),
                paiement.getDateEcheance(),
                paiement.getType(),
                paiement.getReference()
            );
            sendEmailNotification(proprietaire.getEmail(), subject, content);
            sendSmsNotification(proprietaire, "Paiement en retard pour l'appartement " + 
                paiement.getAppartement().getNumero() + ". Montant: " + paiement.getMontant() + " DH");
        });
    }

    @Override
    @Async
    public void notifyPaymentReceived(Paiement paiement) {
        paiement.getAppartement().getProprietaires().forEach(proprietaire -> {
            String subject = "Paiement reçu";
            String content = String.format(
                "Nous avons bien reçu votre paiement pour l'appartement %s.\n" +
                "Montant: %.2f DH\n" +
                "Date de paiement: %s\n" +
                "Type: %s\n" +
                "Référence: %s\n" +
                "Merci pour votre paiement.",
                paiement.getAppartement().getNumero(),
                paiement.getMontant(),
                paiement.getDatePaiement(),
                paiement.getType(),
                paiement.getReference()
            );
            sendEmailNotification(proprietaire.getEmail(), subject, content);
        });
    }

    @Override
    @Async
    public void notifyPaymentCancelled(Paiement paiement) {
        paiement.getAppartement().getProprietaires().forEach(proprietaire -> {
            String subject = "Paiement annulé";
            String content = String.format(
                "Le paiement suivant a été annulé pour l'appartement %s:\n" +
                "Montant: %.2f DH\n" +
                "Type: %s\n" +
                "Référence: %s",
                paiement.getAppartement().getNumero(),
                paiement.getMontant(),
                paiement.getType(),
                paiement.getReference()
            );
            sendEmailNotification(proprietaire.getEmail(), subject, content);
        });
    }
} 