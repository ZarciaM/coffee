package org.example.coffemachine.repository;

import org.example.coffemachine.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, UUID> {

    @Query("SELECT p FROM Payment p WHERE p.delivery.id = :deliveryId")
    Optional<Payment> findByDeliveryId(UUID deliveryId);
}