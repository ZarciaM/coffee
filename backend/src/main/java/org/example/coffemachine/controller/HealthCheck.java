package org.example.coffemachine.controller;


import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthCheck {
    @GetMapping("/ping")
    public String ping() {
        return "pong";
    }
}
