package org.example.coffemachine.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderStatus {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "order_id")
    @JsonBackReference
    private CoffeeOrder order;

    private String status;

    private LocalDateTime statusDate;

    public OrderStatus(CoffeeOrder order, String status, LocalDateTime statusDate) {
        this.order = order;
        this.status = status;
        this.statusDate = statusDate;
    }
}
