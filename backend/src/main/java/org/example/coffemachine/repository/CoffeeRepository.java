package org.example.coffemachine.repository;

import org.example.coffemachine.entity.Coffee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CoffeeRepository extends JpaRepository<
        Coffee, UUID> {
    Optional<Coffee> findById(String id);
    List<Coffee> findAll();
}
