package org.example.coffemachine.service;

import org.example.coffemachine.entity.User;
import org.example.coffemachine.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class UserService {
    private final UserRepository userRepository;
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User findById(String id) {
        UUID uuid = UUID.fromString(id);
        return userRepository.findById(uuid).orElse(null);
    }

    public List<User> findAll() {
        return userRepository.findAll();
    }
}
