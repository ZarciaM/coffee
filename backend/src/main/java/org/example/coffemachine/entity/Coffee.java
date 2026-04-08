package org.example.coffemachine.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@Entity
public class Coffee {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String name;
    private int cost;
    private int preparationTime;

    @ManyToMany
    @JoinTable(
            name = "coffee_add_in",
            joinColumns = @JoinColumn(name = "coffee_id"),
            inverseJoinColumns = @JoinColumn(name = "add_in_id")
    )
    private List<AddIn> addins = new ArrayList<>();
}
