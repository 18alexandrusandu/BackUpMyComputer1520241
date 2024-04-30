package com.example.bodymonitorbackend.Repositories;

import com.example.bodymonitorbackend.Entities.Prescription;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PrescriptionsRepository extends CrudRepository<Prescription,Long> {
}
