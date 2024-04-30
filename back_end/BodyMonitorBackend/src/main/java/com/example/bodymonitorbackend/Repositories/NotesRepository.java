package com.example.bodymonitorbackend.Repositories;

import com.example.bodymonitorbackend.Entities.Note;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NotesRepository extends CrudRepository<Note,Long> {

}
