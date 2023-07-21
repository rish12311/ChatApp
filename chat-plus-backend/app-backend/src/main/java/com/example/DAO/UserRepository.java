package com.example.DAO;

import com.example.model.JwtRequest;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends MongoRepository<JwtRequest, String> {
}
