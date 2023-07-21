package com.example.DAO;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import com.example.model.Doctor;

@Repository
public interface DoctorRepository extends CrudRepository<Doctor, String> {
}
