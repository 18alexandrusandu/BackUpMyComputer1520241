package com.example.bodymonitorbackend.Repositories;

import com.example.bodymonitorbackend.Entities.Asignment;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AsignmentRepository  extends CrudRepository<Asignment,Long> {
    List<Asignment> findAllByAsistantId(Long id);
}
