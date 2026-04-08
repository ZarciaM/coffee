package org.example.coffemachine.controller;
import org.example.coffemachine.entity.CoffeeOrder;
import org.example.coffemachine.entity.OrderStatus;
import org.example.coffemachine.service.CoffeeOrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;
@RestController
@RequestMapping("/orders")
public class CoffeeOrderController {
    private final CoffeeOrderService coffeeOrderService;
    public CoffeeOrderController(CoffeeOrderService coffeeOrderService) {
        this.coffeeOrderService = coffeeOrderService;
    }
    @PostMapping
    public CoffeeOrder createOrder(@RequestBody CoffeeOrder order) {
        return coffeeOrderService.createOrder(order);
    }
    @GetMapping
    public List<CoffeeOrder> getAllOrders() {
        return coffeeOrderService.getAllOrders();
    }
    @GetMapping("/{id}")
    public CoffeeOrder getOrder(@PathVariable UUID id) {
        return coffeeOrderService.getOrderById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
    }
    @PatchMapping("/{id}/status")
    public OrderStatus updateOrderStatus(@PathVariable UUID id, @RequestParam String status) {
        return coffeeOrderService.updateStatus(id, status);
    }
    @GetMapping("/active")
    public List<CoffeeOrder> getActiveOrders() {
        return coffeeOrderService.getActiveOrders();
    }
}