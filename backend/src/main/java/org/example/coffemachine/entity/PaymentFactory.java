package org.example.coffemachine.entity;

import org.springframework.stereotype.Component;

@Component
public class PaymentFactory {

    public CreditCardPayment createCreditCardPayment(Delivery delivery,
                                                     int totalAmount,
                                                     String cardNumber) {
        return new CreditCardPayment(delivery, totalAmount, cardNumber);
    }

    public MobileMoneyPayment createMobileMoneyPayment(Delivery delivery,
                                                       int totalAmount,
                                                       String phoneNumber,
                                                       String secretCode) {
        return new MobileMoneyPayment(delivery, totalAmount, phoneNumber, secretCode);
    }

    public CashPayment createCashPayment(Delivery delivery,
                                         int totalAmount,
                                         int amount) {
        return new CashPayment(delivery, totalAmount, amount);
    }
}
