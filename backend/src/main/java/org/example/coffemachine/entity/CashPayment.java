package org.example.coffemachine.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@DiscriminatorValue("CASH")
@NoArgsConstructor
@Getter
@Setter
public class CashPayment extends Payment {

    private int amount;

    public CashPayment(Delivery delivery, int totalAmount, int amount) {
        super(delivery, totalAmount);
        this.amount = amount;
        this.setTransactionReference(null);
    }
}

