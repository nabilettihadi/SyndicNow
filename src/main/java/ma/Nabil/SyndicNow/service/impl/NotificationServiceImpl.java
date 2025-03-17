package ma.Nabil.SyndicNow.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.Nabil.SyndicNow.entity.Paiement;
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
    @Async
    public void notifyPaymentCreated(Paiement paiement) {
        if (paiement.getAppartement().getProprietaire() != null) {
            String subject = "Nouveau paiement créé";
            String content = String.format("""
                    Un nouveau paiement a été créé pour votre appartement %s.
                    Montant: %.2f DH
                    Date d'échéance: %s
                    Type: %s
                    Référence: %s""", paiement.getAppartement().getNumero(), paiement.getMontant(), paiement.getDateEcheance(), paiement.getType(), paiement.getReference());
            sendEmailNotification(paiement.getAppartement().getProprietaire().getEmail(), subject, content);
        }
    }

    @Override
    @Async
    public void notifyPaymentDue(Paiement paiement) {
        if (paiement.getAppartement().getProprietaire() != null) {
            String subject = "Rappel de paiement";
            String content = String.format("""
                    Un paiement arrive à échéance pour votre appartement %s.
                    Montant: %.2f DH
                    Date d'échéance: %s
                    Type: %s
                    Référence: %s""", paiement.getAppartement().getNumero(), paiement.getMontant(), paiement.getDateEcheance(), paiement.getType(), paiement.getReference());
            sendEmailNotification(paiement.getAppartement().getProprietaire().getEmail(), subject, content);
        }
    }

    @Override
    @Async
    public void notifyPaymentOverdue(Paiement paiement) {
        if (paiement.getAppartement().getProprietaire() != null) {
            String subject = "Paiement en retard";
            String content = String.format("""
                    Un paiement est en retard pour votre appartement %s.
                    Montant: %.2f DH
                    Date d'échéance: %s
                    Type: %s
                    Référence: %s
                    Veuillez régulariser votre situation dès que possible.""", paiement.getAppartement().getNumero(), paiement.getMontant(), paiement.getDateEcheance(), paiement.getType(), paiement.getReference());
            sendEmailNotification(paiement.getAppartement().getProprietaire().getEmail(), subject, content);
        }
    }

    @Override
    @Async
    public void notifyPaymentReceived(Paiement paiement) {
        if (paiement.getAppartement().getProprietaire() != null) {
            String subject = "Paiement reçu";
            String content = String.format("""
                    Nous avons bien reçu votre paiement pour l'appartement %s.
                    Montant: %.2f DH
                    Date de paiement: %s
                    Type: %s
                    Référence: %s
                    Merci pour votre paiement.""", paiement.getAppartement().getNumero(), paiement.getMontant(), paiement.getDatePaiement(), paiement.getType(), paiement.getReference());
            sendEmailNotification(paiement.getAppartement().getProprietaire().getEmail(), subject, content);
        }
    }

    @Override
    @Async
    public void notifyPaymentCancelled(Paiement paiement) {
        if (paiement.getAppartement().getProprietaire() != null) {
            String subject = "Paiement annulé";
            String content = String.format("""
                    Le paiement suivant a été annulé pour l'appartement %s:
                    Montant: %.2f DH
                    Type: %s
                    Référence: %s""", paiement.getAppartement().getNumero(), paiement.getMontant(), paiement.getType(), paiement.getReference());
            sendEmailNotification(paiement.getAppartement().getProprietaire().getEmail(), subject, content);
        }
    }
} 