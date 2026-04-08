package org.example.coffemachine.controller;

import org.example.coffemachine.dto.CashRequest;
import org.example.coffemachine.dto.CreditCardRequest;
import org.example.coffemachine.dto.MobileMoneyRequest;
import org.example.coffemachine.entity.*;
import org.example.coffemachine.service.PaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/credit-card")
    public ResponseEntity<CreditCardPayment> createCreditCardPayment(@RequestBody CreditCardRequest request) {
        return ResponseEntity.ok(paymentService.createCreditCardPayment(
                request.deliveryId,
                request.cardNumber
        ));
    }

    @PostMapping("/mobile-money")
    public ResponseEntity<MobileMoneyPayment> createMobileMoneyPayment(@RequestBody MobileMoneyRequest request) {
        return ResponseEntity.ok(paymentService.createMobileMoneyPayment(
                request.deliveryId,
                request.phoneNumber,
                request.secretCode
        ));
    }

    @PostMapping("/cash")
    public ResponseEntity<CashPayment> createCashPayment(@RequestBody CashRequest request) {
        return ResponseEntity.ok(paymentService.createCashPayment(
                request.deliveryId,
                request.amount
        ));
    }

    @GetMapping
    public ResponseEntity<List<Payment>> getAllPayments() {
        return ResponseEntity.ok(paymentService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Payment> getPaymentById(@PathVariable UUID id) {
        return paymentService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/delivery/{deliveryId}")
    public ResponseEntity<Payment> getPaymentByDelivery(@PathVariable String deliveryId) {
        return paymentService.findByDeliveryId(deliveryId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
