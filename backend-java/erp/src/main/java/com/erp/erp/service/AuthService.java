package com.erp.erp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.erp.erp.dto.SignupRequest;
import com.erp.erp.models.User;
import com.erp.erp.repository.UserRepository;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public String signup(SignupRequest request){
      
        User user = new User();
        user.setEmail(request.getEmail());

        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setName(request.getName());
        user.setUsername(request.getUsername());
        user.setRole("USER");
        user.setAdmin(false);


        if(request.getUsername() == null || request.getUsername().isEmpty()){
            throw new RuntimeException("Username is empty");
        }

        if(request.getEmail() == null || request.getEmail().isEmpty()){
            throw new RuntimeException("Email is empty");
        }

        if(request.getPassword() == null || request.getPassword().isEmpty()){
            throw new RuntimeException("Password is empty");
        }

        if(request.getName() == null || request.getName().isEmpty()){
            throw new RuntimeException("Name is empty");
        }
        

        if(userRepository.findByUsername(request.getUsername()).isPresent() 
                || userRepository.findByEmail(request.getEmail()).isPresent()){
            throw new RuntimeException("Username and email both are exists");
        }

        if(userRepository.findByUsername(request.getUsername()).isPresent()){
            throw new RuntimeException("Username already exists");
        }
        if(userRepository.findByEmail(request.getEmail()).isPresent()){
            throw new RuntimeException("Email already exists");
        }
        userRepository.save(user);
        return "user created Successfully"; 

    }
  //login using jwt 
  


}
