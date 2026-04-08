package org.example.coffemachine.controller;

import org.example.coffemachine.entity.Coffee;
import org.example.coffemachine.repository.CoffeeRepository;
import org.example.coffemachine.service.CoffeeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/coffee")

public class CoffeeController {
    private CoffeeService coffeeService;

    public CoffeeController(CoffeeService coffeeService) {
        this.coffeeService = coffeeService;
    }
    @GetMapping
    public List<Coffee> findAll() {
        return coffeeService.find();
    }
    @GetMapping("/{id}")
    public ResponseEntity<Coffee> findById(@PathVariable String id) {
        return coffeeService.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
