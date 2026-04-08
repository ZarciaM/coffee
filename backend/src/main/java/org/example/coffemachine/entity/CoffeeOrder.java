package org.example.coffemachine.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@NoArgsConstructor
@Getter
@Setter
@AllArgsConstructor
@Entity
public class CoffeeOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private int totalPrice;

    @ManyToMany
    @JoinTable(
            name = "coffee_order_to_coffee",
            joinColumns = @JoinColumn(name = "id_coffee_order"),
            inverseJoinColumns = @JoinColumn(name = "id_coffee")
    )
    @NotEmpty(message = "A coffee order must contain at least one coffee")
    private List<Coffee> coffees = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "id_delivery")
    @JsonBackReference
    private Delivery delivery;


    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference


    private List<OrderStatus> statuses = new ArrayList<>();
}
