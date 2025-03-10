package ma.Nabil.SyndicNow.service;

import ma.Nabil.SyndicNow.entity.Paiement;
import ma.Nabil.SyndicNow.entity.User;

public interface NotificationService {
    void notifyPaymentCreated(Paiement paiement);

    void notifyPaymentDue(Paiement paiement);

    void notifyPaymentOverdue(Paiement paiement);

    void notifyPaymentReceived(Paiement paiement);

    void notifyPaymentCancelled(Paiement paiement);

    void sendEmailNotification(String email, String subject, String content);

    void sendSmsNotification(User user, String content);
} 