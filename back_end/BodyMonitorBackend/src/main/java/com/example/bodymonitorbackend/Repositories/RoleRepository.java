package com.example.bodymonitorbackend.Repositories;

import com.example.bodymonitorbackend.Entities.Role;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoleRepository extends CrudRepository<Role,Long> {
}
