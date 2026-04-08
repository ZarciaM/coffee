package org.example.coffemachine.repository;

import org.example.coffemachine.entity.CoffeeOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface CoffeeOrderRepository extends JpaRepository<CoffeeOrder, UUID> {
}
