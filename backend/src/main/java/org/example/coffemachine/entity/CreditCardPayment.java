package org.example.coffemachine.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@DiscriminatorValue("CREDIT_CARD")
@NoArgsConstructor
@Getter
@Setter
public class CreditCardPayment extends Payment {

    private String cardNumber;

    public CreditCardPayment(Delivery delivery, int totalAmount, String cardNumber) {
        super(delivery, totalAmount);
        this.cardNumber = cardNumber;
        this.setTransactionReference(null);
    }
}
