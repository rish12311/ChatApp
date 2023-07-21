package com.example.controller;

import com.example.DAO.UserRepository;
import com.example.config_security.JwtHelper;
import com.example.config_security.MyConfig;
import com.example.handler.ChatWebSocketHandler;
import com.example.model.JwtRequest;
import com.example.model.JwtResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@Configuration
@CrossOrigin
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private AuthenticationManager manager;


    @Autowired
    private JwtHelper helper;

    private Logger logger = LoggerFactory.getLogger(AuthController.class);


    @PostMapping("/authenticate")
    public ResponseEntity<JwtResponse> login(@RequestBody JwtRequest request) {

        this.doAuthenticate(request.getUsername(), request.getPassword());
        Optional<JwtRequest> usernew =  userRepository.findById(request.getUsername());
        System.out.println(request.getPassword());
        System.out.println(usernew.get().getPassword());
        if(usernew.get().getPassword().equalsIgnoreCase(request.getPassword())) {


            UserDetails userDetails = User.builder().
                    username(usernew.get().getUsername())
                    .password(new BCryptPasswordEncoder().encode(usernew.get().getPassword())).roles("ADMIN").
                    build();
            new InMemoryUserDetailsManager(userDetails);

            System.out.println(userDetails.toString());
            String token = this.helper.generateToken(userDetails);

            JwtResponse response = JwtResponse.builder()
                    .jwtToken(token)
                    .username(userDetails.getUsername()).build();
            return new ResponseEntity<>(response, HttpStatus.OK);


        }
        else {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    private void doAuthenticate(String email, String password) {

        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(email, password);
        try {
            Optional<JwtRequest> usernew =  userRepository.findById(email);
            if(usernew.get().getPassword() == password){
            }
        } catch (BadCredentialsException e) {
            throw new BadCredentialsException(" Invalid Username or Password  !!");
        }

    }

    @ExceptionHandler(BadCredentialsException.class)
    public String exceptionHandler() {
        return "Credentials Invalid !!";
    }

}
