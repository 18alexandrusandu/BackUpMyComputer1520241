package com.example.bodymonitorbackend.Repositories;

import com.example.bodymonitorbackend.Entities.UserAccount;
import org.apache.catalina.User;
import org.hibernate.sql.ast.tree.update.Assignment;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends CrudRepository<UserAccount,Long>
{

    Optional<UserAccount> findUserAccountByUsername(String username);
    Optional<UserAccount> findUserAccountByFingerId(int fingerId);

    List<UserAccount> findAllByRoleType(String type);

    Optional<UserAccount>  findFirstByEmail(String email);

    List<UserAccount> findAllByRoleTypeAndAsignmentsIsNull(String typeUser);

    List<UserAccount> findAllByRoleTypeAndAsignmentsIsNotNull(String typeUser);


}
