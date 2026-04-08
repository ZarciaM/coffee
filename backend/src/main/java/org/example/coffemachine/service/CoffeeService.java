package org.example.coffemachine.service;


import org.example.coffemachine.entity.Coffee;
import org.example.coffemachine.repository.CoffeeRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class CoffeeService {
    private CoffeeRepository coffeeRepository;

    public CoffeeService(CoffeeRepository coffeeRepository) {
        this.coffeeRepository = coffeeRepository;
    }

    public List<Coffee> find() {
        return coffeeRepository.findAll();
    }

    public Optional<Coffee> findById(String id) {
        UUID uuid = UUID.fromString(id);

        return coffeeRepository.findById(uuid);
    }

}
