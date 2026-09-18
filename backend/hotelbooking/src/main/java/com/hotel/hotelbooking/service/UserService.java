package com.hotel.hotelbooking.service;

import com.hotel.hotelbooking.entity.User;
import com.hotel.hotelbooking.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    public User registerUser(User user) {
        return userRepository.save(user);
    }


    public User loginUser(String email, String password){
        Optional<User> user = userRepository.findByEmail(email);

        if(user.isPresent() && user.get().getPassword().equals(password)){
            return user.get();
        }
        return null;
   }

   public List<User> getAllUsers(){
        return userRepository.findAll();
   }

   public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
   }
}
