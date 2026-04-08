package org.example.coffemachine.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "delivery")
public class Delivery {

    @Id
    @Column(columnDefinition = "uuid")
    private UUID id;

    private LocalDateTime date;

    @Column(name = "place_to_deliver")
    private String placeToDeliver;

    private int duration;


    @ManyToMany
    @JoinTable(
            name = "vehicle_delivery",
            joinColumns = @JoinColumn(name = "id_delivery"),
            inverseJoinColumns = @JoinColumn(name = "id_vehicle")
    )
    private List<Vehicle> vehicles = new ArrayList<>();

    @OneToMany(mappedBy = "delivery", cascade = CascadeType.ALL)
    @JsonManagedReference
    @NotEmpty
    private List<CoffeeOrder> coffeeOrders = new ArrayList<>();


    @OneToMany(mappedBy = "delivery", cascade = CascadeType.ALL)
    @JsonManagedReference

    private List<StatusProperties> statusHistory = new ArrayList<>();
}