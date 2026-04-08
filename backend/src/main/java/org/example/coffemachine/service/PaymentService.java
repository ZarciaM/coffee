package org.example.coffemachine.service;


import org.example.coffemachine.entity.*;
import org.example.coffemachine.entity.PaymentFactory;
import org.example.coffemachine.repository.PaymentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final DeliveryService deliveryService;
    private final PaymentFactory paymentFactory;

    public PaymentService(PaymentRepository paymentRepository,
                          DeliveryService deliveryService,
                          PaymentFactory paymentFactory) {
        this.paymentRepository = paymentRepository;
        this.deliveryService = deliveryService;
        this.paymentFactory = paymentFactory;
    }

    public CreditCardPayment createCreditCardPayment(String deliveryId, String cardNumber) {
        Delivery delivery = deliveryService.findById(deliveryId).orElseThrow();
        int total = calculateTotal(delivery);
        CreditCardPayment payment = paymentFactory.createCreditCardPayment(delivery, total, cardNumber);
        return paymentRepository.save(payment);
    }

    public MobileMoneyPayment createMobileMoneyPayment(String deliveryId,
                                                       String phoneNumber,
                                                       String secretCode) {
        Delivery delivery = deliveryService.findById(deliveryId).orElseThrow();
        int total = calculateTotal(delivery);
        MobileMoneyPayment payment = paymentFactory.createMobileMoneyPayment(delivery, total, phoneNumber, secretCode);
        return paymentRepository.save(payment);
    }

    public CashPayment createCashPayment(String deliveryId, int amount) {
        Delivery delivery = deliveryService.findById(deliveryId).orElseThrow();
        int total = calculateTotal(delivery);
        CashPayment payment = paymentFactory.createCashPayment(delivery, total, amount);
        return paymentRepository.save(payment);
    }

    public Optional<Payment> findById(UUID id) {
        return paymentRepository.findById(id);
    }

    public List<Payment> findAll() {
        return paymentRepository.findAll();
    }

    public Optional<Payment> findByDeliveryId(String deliveryId) {
        return paymentRepository.findByDeliveryId(UUID.fromString(deliveryId));
    }

    private int calculateTotal(Delivery delivery) {
        int coffeesTotal = delivery.getCoffeeOrders().stream()
                .mapToInt(order -> order.getCoffees().stream()
                        .mapToInt(coffee -> coffee.getCost() +
                                coffee.getAddins().stream().mapToInt(AddIn::getPrice).sum())
                        .sum())
                .sum();

        int vehiclesTotal = delivery.getVehicles().stream()
                .mapToInt(Vehicle::getPrice)
                .sum();

        return coffeesTotal + vehiclesTotal;
    }
}