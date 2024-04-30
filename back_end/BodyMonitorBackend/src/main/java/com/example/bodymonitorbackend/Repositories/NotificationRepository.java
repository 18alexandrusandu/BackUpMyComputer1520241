package com.example.bodymonitorbackend.Repositories;

import com.example.bodymonitorbackend.Entities.Notification;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
@Repository
public interface NotificationRepository extends CrudRepository<Notification,Long> {
    List<Notification> findAllByUserId(Long userId);
}
