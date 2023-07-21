package com.example.controller;

import com.example.DAO.DoctorRepository;
import com.example.model.Doctor;
import com.example.model.MessageDto;
import com.example.model.ResponseRedis;
import com.example.model.StatusHelper;
import com.example.service.mainService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@Configuration
@EnableMongoRepositories
@CrossOrigin
public class MainController {

    @Autowired
    private mainService ms;
    @Autowired
    private DoctorRepository dr;

    @PostMapping("/adddoctor")
    public ResponseRedis addDoctorInfo(@RequestBody Doctor doctor) {
        System.out.println(doctor.getUsername());
        return ms.saveDetails(doctor);
    }

    @GetMapping("/getalldoctor")
    public List<Doctor> getAllDcot(){
        return (List<Doctor>) dr.findAll();
    }

    @GetMapping("/getdoctorid/{username}")
    public String getPersonById(@PathVariable String username) {
        Optional<Doctor> optionalPerson = dr.findById(username);

        if (optionalPerson.isPresent()) {
            Doctor person = optionalPerson.get();
            return person.getId();
        }
        return "id not found";
    }

    @DeleteMapping("/deletedoctor/{username}")
    public String deleteStudent(@PathVariable String username) {
        Optional<Doctor> optionalStudent = dr.findById(username);

        if (optionalStudent.isPresent()) {
            dr.deleteById(username);
            return "Person deleted successfully.";
        } else {
            return "Not Deleted Error!!";
        }
    }

    @PutMapping("/updateinfo/{username}")
    public ResponseEntity<Object> updatePersonInfo(@PathVariable String username, @RequestBody StatusHelper updatedPerson) {
        Optional<Doctor> optionalPerson = dr.findById(username);

        if (optionalPerson.isPresent()) {
            Doctor existingPerson = optionalPerson.get();
            existingPerson.setStatus(updatedPerson.getStatus());

            dr.save(existingPerson);
            return ResponseEntity.ok().body("{'message': 'Updated'}");
        }

        return ResponseEntity.notFound().build();
    }



}