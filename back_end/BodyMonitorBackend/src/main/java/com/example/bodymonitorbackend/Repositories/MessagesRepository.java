package com.example.bodymonitorbackend.Repositories;

import com.example.bodymonitorbackend.Entities.Message;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface MessagesRepository extends CrudRepository<Message,Long> {
    List<Message> findAllBySensorId(Long sensorId);
    List<Message> findAllBySensorIdAndTimestampBetween(Long sensorId, Date date1,Date date2);


}
