package com.example.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import com.example.DAO.DoctorRepository;

import com.example.model.Doctor;
import com.example.model.ResponseRedis;



@Service
public class mainService {
    @Autowired
    private DoctorRepository dr;
    public ResponseRedis saveDetails(Doctor doctor) {

        ResponseRedis response=new ResponseRedis();
        try {
            dr.save(doctor);
            response.setStatus("Succes");
            response.setMessage("Good");
        }
        catch(Exception e)
        {
            response.setStatus("Failure");
            response.setMessage(e.toString());
        }
        return response;
    }

}
