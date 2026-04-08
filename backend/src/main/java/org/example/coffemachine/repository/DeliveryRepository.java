package org.example.coffemachine.repository;

import org.example.coffemachine.entity.Delivery;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface DeliveryRepository extends JpaRepository<Delivery, UUID> {
    List<Delivery> findAll();
    Optional<Delivery> findById(UUID uuid);
}
