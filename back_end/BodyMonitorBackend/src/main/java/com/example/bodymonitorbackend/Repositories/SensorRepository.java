package com.example.bodymonitorbackend.Repositories;

import com.example.bodymonitorbackend.Entities.Sensor;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SensorRepository extends CrudRepository<Sensor,Long> {
}
