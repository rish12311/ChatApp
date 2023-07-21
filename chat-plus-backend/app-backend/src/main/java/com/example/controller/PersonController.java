package com.example.controller;

import com.example.DAO.DoctorRepository;
import com.example.DAO.UserRepository;
import com.example.handler.ChatWebSocketHandler;
import com.example.model.Doctor;
import com.example.model.JwtRequest;
import com.example.model.ResponseRedis;
import com.example.service.mainService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;
import org.springframework.data.redis.repository.configuration.EnableRedisRepositories;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.socket.WebSocketSession;

import java.util.List;
import java.util.Optional;


@RestController
@Configuration
@EnableMongoRepositories
@CrossOrigin
@EnableRedisRepositories
@EnableCaching
@RequestMapping("/new")
public class PersonController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/add")
    public String addAuthPerson(@RequestBody JwtRequest jwtRequest){
        userRepository.save(jwtRequest);
        return "Saved";
    }

}