package org.example.coffemachine.controller;


import org.example.coffemachine.entity.Coffee;
import org.example.coffemachine.entity.User;
import org.example.coffemachine.service.UserService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class UserController {
 private UserService userService;

 public UserController(UserService userService) {
     this.userService = userService;
 }

 @GetMapping("/users")
public List<User> findAll() {
     return userService.findAll();
 }

 @GetMapping("/user/{id}")
    public User findUser(@PathVariable  String id) {
     return userService.findById(id);
 }
}
