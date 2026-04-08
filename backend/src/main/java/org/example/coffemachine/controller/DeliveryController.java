package org.example.coffemachine.controller;
import org.example.coffemachine.entity.CoffeeOrder;
import org.example.coffemachine.entity.Delivery;
import org.example.coffemachine.service.CoffeeOrderService;
import org.example.coffemachine.service.DeliveryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;
@RestController
@RequestMapping("/delivery")
public class DeliveryController {
    private final DeliveryService deliveryService;
    private final CoffeeOrderService coffeeOrderService;
    public DeliveryController(DeliveryService deliveryService,
                              CoffeeOrderService coffeeOrderService) {
        this.deliveryService = deliveryService;
        this.coffeeOrderService = coffeeOrderService;
    }
    @GetMapping
    public ResponseEntity<List<Delivery>> getAllDeliveries() {
        return ResponseEntity.ok(deliveryService.findAll());
    }
    @GetMapping("/{id}")
    public ResponseEntity<Delivery> getDelivery(@PathVariable String id) {
        return deliveryService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    @PostMapping
    public ResponseEntity<Delivery> createDelivery(@RequestBody Delivery delivery) {
        Delivery created = deliveryService.save(delivery);
        return ResponseEntity.ok(created);
    }
    @PutMapping("/{id}")
    public ResponseEntity<Delivery> updateDelivery(
            @PathVariable String id,
            @RequestBody Delivery newData
    ) {
        try {
            Delivery updated = deliveryService.update(id, newData);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDelivery(@PathVariable String id) {
        if (!deliveryService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        deliveryService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

}