package org.example.coffemachine.service;
import org.example.coffemachine.entity.CoffeeOrder;
import org.example.coffemachine.entity.OrderStatus;
import org.example.coffemachine.repository.CoffeeOrderRepository;
import org.example.coffemachine.repository.OrderStatusRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
@Service
public class CoffeeOrderService {
    private final CoffeeOrderRepository coffeeOrderRepository;
    private final OrderStatusRepository orderStatusRepository;
    public CoffeeOrderService(CoffeeOrderRepository coffeeOrderRepository,
                              OrderStatusRepository orderStatusRepository) {
        this.coffeeOrderRepository = coffeeOrderRepository;
        this.orderStatusRepository = orderStatusRepository;
    }
    public List<CoffeeOrder> getAllOrders() {
        return coffeeOrderRepository.findAll();
    }
    public Optional<CoffeeOrder> getOrderById(UUID id) {
        return coffeeOrderRepository.findById(id);
    }
    public CoffeeOrder createOrder(CoffeeOrder order) {
        CoffeeOrder saved = coffeeOrderRepository.save(order);
        orderStatusRepository.save(new OrderStatus(saved, "PENDING", LocalDateTime.now()));
        return saved;
    }
    public CoffeeOrder updateOrder(UUID id, CoffeeOrder updatedOrder) {
        return coffeeOrderRepository.findById(id)
                .map(order -> {
                    order.setTotalPrice(updatedOrder.getTotalPrice());
                    order.setCoffees(updatedOrder.getCoffees());
                    return coffeeOrderRepository.save(order);
                }).orElseThrow(() -> new RuntimeException("Order not found"));
    }
    public void deleteOrder(UUID id) {
        coffeeOrderRepository.deleteById(id);
    }
    public OrderStatus updateStatus(UUID orderId, String newStatus) {
        CoffeeOrder order = coffeeOrderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        OrderStatus status = new OrderStatus(order, newStatus, LocalDateTime.now());
        return orderStatusRepository.save(status);
    }
    public List<CoffeeOrder> getActiveOrders() {
        return coffeeOrderRepository.findAll().stream()
                .filter(order -> {
                    List<OrderStatus> statuses = orderStatusRepository.findByOrderOrderByStatusDateDesc(order);
                    return statuses.isEmpty() || (!statuses.get(0).getStatus().equals("DELIVERED")
                            && !statuses.get(0).getStatus().equals("CANCELLED"));
                }).toList();
    }
}