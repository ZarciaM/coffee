package org.example.coffemachine.service;

import org.example.coffemachine.entity.CoffeeOrder;
import org.example.coffemachine.entity.Delivery;
import org.example.coffemachine.entity.DeliveryStatus;
import org.example.coffemachine.entity.StatusProperties;
import org.example.coffemachine.repository.DeliveryRepository;
import org.example.coffemachine.repository.CoffeeOrderRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class DeliveryService {

    private final DeliveryRepository deliveryRepository;
    private final CoffeeOrderRepository coffeeOrderRepository;

    public DeliveryService(DeliveryRepository deliveryRepository,
                           CoffeeOrderRepository coffeeOrderRepository) {
        this.deliveryRepository = deliveryRepository;
        this.coffeeOrderRepository = coffeeOrderRepository;
    }

    public Optional<Delivery> findById(String id) {
        UUID uuid = UUID.fromString(id);
        return deliveryRepository.findById(uuid);
    }

    public List<Delivery> findAll() {
        return deliveryRepository.findAll();
    }

    public Delivery save(Delivery delivery) {
        if (delivery.getId() == null) {
            delivery.setId(UUID.randomUUID());
        }
        return deliveryRepository.save(delivery);
    }

    public Delivery update(String id, Delivery newData) {
        UUID uuid = UUID.fromString(id);

        return deliveryRepository.findById(uuid)
                .map(existing -> {
                    existing.setDate(newData.getDate());
                    existing.setPlaceToDeliver(newData.getPlaceToDeliver());
                    existing.setDuration(newData.getDuration());
                    return deliveryRepository.save(existing);
                })
                .orElseThrow(() -> new RuntimeException("Delivery not found"));
    }

    public void delete(Delivery delivery) {
        deliveryRepository.delete(delivery);
    }

    public void deleteById(String id) {
        UUID uuid = UUID.fromString(id);
        deliveryRepository.deleteById(uuid);
    }

    public boolean existsById(String id) {
        UUID uuid = UUID.fromString(id);
        return deliveryRepository.existsById(uuid);
    }



    public void simulateBrew(UUID orderId) {
        CoffeeOrder order = coffeeOrderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));


        Delivery delivery = order.getDelivery();
        if (delivery != null) {
            delivery.getStatusHistory().add(new StatusProperties(delivery, DeliveryStatus.DELIVERING, LocalDateTime.now()));
            deliveryRepository.save(delivery);
        }

        coffeeOrderRepository.save(order);
    }

    public Delivery simulateDeliver(UUID orderId) {
        CoffeeOrder order = coffeeOrderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        Delivery delivery = order.getDelivery();
        if (delivery == null) {
            throw new RuntimeException("Delivery not assigned for this order");
        }


        delivery.getStatusHistory().add(new StatusProperties(delivery, DeliveryStatus.DELIVERING, LocalDateTime.now()));
        deliveryRepository.save(delivery);

        delivery.getStatusHistory().add(new StatusProperties(delivery, DeliveryStatus.DELIVERED, LocalDateTime.now()));
        deliveryRepository.save(delivery);

        return delivery;
    }
}
