package org.example.coffemachine.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "payment_type")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Table(name = "payment")
public abstract class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne
    @JoinColumn(name = "delivery_id")
    private Delivery delivery;

    private int totalAmount;
    private LocalDateTime paymentDate;
    private String transactionReference;

    public Payment(Delivery delivery, int totalAmount) {
        this.delivery = delivery;
        this.totalAmount = totalAmount;
        this.paymentDate = LocalDateTime.now();
    }
}

