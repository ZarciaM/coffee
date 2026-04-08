package org.example.coffemachine.repository;

import org.example.coffemachine.entity.OrderStatus;
import org.example.coffemachine.entity.CoffeeOrder;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface OrderStatusRepository extends JpaRepository<OrderStatus, UUID> {
    List<OrderStatus> findByOrderOrderByStatusDateDesc(CoffeeOrder order);
    List<OrderStatus> findByStatus(String status);
}
