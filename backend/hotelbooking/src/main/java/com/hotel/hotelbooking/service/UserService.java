package com.hotel.hotelbooking.service;

import com.hotel.hotelbooking.entity.User;
import com.hotel.hotelbooking.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User registerUser(User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "An account with this email already exists.");
        }

        // Never trust the role sent by the browser
        user.setRole("USER");

        // Store only the BCrypt hash, never the plain password
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        return userRepository.save(user);
    }

    public User loginUser(String email, String password) {
        Optional<User> user = userRepository.findByEmail(email);

        if (user.isEmpty()) {
            return null;
        }

        User existingUser = user.get();
        String storedPassword = existingUser.getPassword();

        // Accounts created before hashing still have a plain password.
        // If it matches, hash it now so it is stored safely from here on.
        if (!storedPassword.startsWith("$2")) {
            if (storedPassword.equals(password)) {
                existingUser.setPassword(passwordEncoder.encode(password));
                return issueToken(existingUser);
            }
            return null;
        }

        if (passwordEncoder.matches(password, storedPassword)) {
            return issueToken(existingUser);
        }
        return null;
    }

    private User issueToken(User user) {
        user.setAuthToken(UUID.randomUUID().toString());
        return userRepository.save(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    // Finds the logged-in user from the "Authorization: Bearer <token>" header
    public User requireUser(String authorization) {
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,
                    "Please log in.");
        }

        String token = authorization.substring("Bearer ".length());

        return userRepository.findByAuthToken(token)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED,
                        "Your session has expired. Please log in again."));
    }

    public User requireAdmin(String authorization) {
        User user = requireUser(authorization);

        if (!isAdmin(user)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Only admin can do this.");
        }
        return user;
    }

    // Lets a user act on their own data; admins can act on anyone's
    public void requireSelfOrAdmin(User user, Long ownerId) {
        if (!isAdmin(user) && !user.getId().equals(ownerId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "You can only access your own bookings.");
        }
    }

    private boolean isAdmin(User user) {
        return "ADMIN".equals(user.getRole());
    }

}
