package ma.Nabil.SyndicNow.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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

    @Override
    @Async
    public void notifyPaymentCreated(Paiement paiement) {
        User proprietaire = paiement.getAppartement().getProprietaire();
        String subject = "Nouveau paiement créé";
        String content = String.format("Un nouveau paiement a été créé pour votre appartement %s.\n" + "Montant: %.2f DH\n" + "Date d'échéance: %s\n" + "Type: %s\n" + "Référence: %s", paiement.getAppartement().getNumero(), paiement.getMontant(), paiement.getDateEcheance(), paiement.getType(), paiement.getReference());
        sendEmailNotification(proprietaire, subject, content);
    }

    @Override
    @Async
    public void notifyPaymentDue(Paiement paiement) {
        User proprietaire = paiement.getAppartement().getProprietaire();
        String subject = "Rappel de paiement";
        String content = String.format("Un paiement arrive à échéance pour votre appartement %s.\n" + "Montant: %.2f DH\n" + "Date d'échéance: %s\n" + "Type: %s\n" + "Référence: %s", paiement.getAppartement().getNumero(), paiement.getMontant(), paiement.getDateEcheance(), paiement.getType(), paiement.getReference());
        sendEmailNotification(proprietaire, subject, content);
    }

    @Override
    @Async
    public void notifyPaymentOverdue(Paiement paiement) {
        User proprietaire = paiement.getAppartement().getProprietaire();
        String subject = "Paiement en retard";
        String content = String.format("Un paiement est en retard pour votre appartement %s.\n" + "Montant: %.2f DH\n" + "Date d'échéance: %s\n" + "Type: %s\n" + "Référence: %s\n" + "Veuillez régulariser votre situation dès que possible.", paiement.getAppartement().getNumero(), paiement.getMontant(), paiement.getDateEcheance(), paiement.getType(), paiement.getReference());
        sendEmailNotification(proprietaire, subject, content);
        sendSmsNotification(proprietaire, "Paiement en retard pour l'appartement " + paiement.getAppartement().getNumero() + ". Montant: " + paiement.getMontant() + " DH");
    }

    @Override
    @Async
    public void notifyPaymentReceived(Paiement paiement) {
        User proprietaire = paiement.getAppartement().getProprietaire();
        String subject = "Paiement reçu";
        String content = String.format("Nous avons bien reçu votre paiement pour l'appartement %s.\n" + "Montant: %.2f DH\n" + "Date de paiement: %s\n" + "Type: %s\n" + "Référence: %s\n" + "Merci pour votre paiement.", paiement.getAppartement().getNumero(), paiement.getMontant(), paiement.getDatePaiement(), paiement.getType(), paiement.getReference());
        sendEmailNotification(proprietaire, subject, content);
    }

    @Override
    @Async
    public void notifyPaymentCancelled(Paiement paiement) {
        User proprietaire = paiement.getAppartement().getProprietaire();
        String subject = "Paiement annulé";
        String content = String.format("Le paiement suivant a été annulé pour l'appartement %s:\n" + "Montant: %.2f DH\n" + "Type: %s\n" + "Référence: %s", paiement.getAppartement().getNumero(), paiement.getMontant(), paiement.getType(), paiement.getReference());
        sendEmailNotification(proprietaire, subject, content);
    }

    @Override
    @Async
    public void sendEmailNotification(User user, String subject, String content) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(user.getEmail());
            message.setSubject(subject);
            message.setText(content);
            emailSender.send(message);
            log.info("Email notification sent to {}: {}", user.getEmail(), subject);
        } catch (Exception e) {
            log.error("Failed to send email notification to {}: {}", user.getEmail(), e.getMessage());
        }
    }

    @Override
    @Async
    public void sendSmsNotification(User user, String content) {
        // TODO: Implement SMS notification using a third-party service
        log.info("SMS notification would be sent to {}: {}", user.getTelephone(), content);
    }
} 