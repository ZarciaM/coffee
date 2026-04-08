package org.example.coffemachine.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Entity
@DiscriminatorValue("MOBILE_MONEY")
@NoArgsConstructor
@Getter
@Setter
public class MobileMoneyPayment extends Payment {

    private String phoneNumber;
    private String secretCode;

    public MobileMoneyPayment(Delivery delivery, int totalAmount,
                              String phoneNumber, String secretCode) {
        super(delivery, totalAmount);
        this.phoneNumber = phoneNumber;
        this.secretCode = secretCode;
        this.setTransactionReference("MM-" + System.currentTimeMillis());
    }
}

