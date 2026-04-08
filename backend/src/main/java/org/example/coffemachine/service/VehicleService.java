package org.example.coffemachine.service;

import org.example.coffemachine.entity.Vehicle;
import org.example.coffemachine.repository.VehicleRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class VehicleService {

    private final VehicleRepository vehicleRepository;

    public VehicleService(VehicleRepository vehicleRepository) {
        this.vehicleRepository = vehicleRepository;
    }

    public List<Vehicle> findAll() {
        return vehicleRepository.findAll();
    }

    public Vehicle findById(String id) {
        return vehicleRepository.findById(UUID.fromString(id))
                .orElse(null);
    }

    public Vehicle save(Vehicle vehicle) {
        if (vehicle.getId() == null) {
            vehicle.setId(UUID.randomUUID());
        }
        return vehicleRepository.save(vehicle);
    }

    public Vehicle update(String id, Vehicle data) {
        return vehicleRepository.findById(UUID.fromString(id))
                .map(v -> {
                    v.setName(data.getName());
                    v.setPrice(data.getPrice());
                    v.setTimeGain(data.getTimeGain());
                    return vehicleRepository.save(v);
                })
                .orElse(null);
    }

    public boolean exists(String id) {
        return vehicleRepository.existsById(UUID.fromString(id));
    }

    public void delete(String id) {
        vehicleRepository.deleteById(UUID.fromString(id));
    }
}
