package com.hotel.hotelbooking.controller;

import com.hotel.hotelbooking.entity.User;
import com.hotel.hotelbooking.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public User registerUser(@RequestBody User user){
        return userService.registerUser(user);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> loginUser(@RequestBody User user) {

        User loggedInUser = userService.loginUser(
                user.getEmail(),
                user.getPassword()
        );

        if (loggedInUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // The token is sent only here, once, at login
        return ResponseEntity.ok(Map.of(
                "id", loggedInUser.getId(),
                "name", loggedInUser.getName(),
                "email", loggedInUser.getEmail(),
                "role", loggedInUser.getRole(),
                "token", loggedInUser.getAuthToken()
        ));
    }

    @GetMapping
    public List<User> getAllUsers(
            @RequestHeader(value = "Authorization", required = false) String authorization) {
        userService.requireAdmin(authorization);
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public Optional<User> getUserById(
            @PathVariable Long id,
            @RequestHeader(value = "Authorization", required = false) String authorization) {
        User currentUser = userService.requireUser(authorization);
        userService.requireSelfOrAdmin(currentUser, id);
        return userService.getUserById(id);
    }
}
