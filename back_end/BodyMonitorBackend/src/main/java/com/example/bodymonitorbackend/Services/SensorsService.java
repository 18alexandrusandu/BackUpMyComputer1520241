package com.example.bodymonitorbackend.Services;

import com.example.bodymonitorbackend.Dtos.SensorCreateDto;
import com.example.bodymonitorbackend.Dtos.SensorUpdateDto;
import com.example.bodymonitorbackend.Entities.Sensor;
import com.example.bodymonitorbackend.Entities.UserAccount;
import com.example.bodymonitorbackend.Repositories.SensorRepository;
import com.example.bodymonitorbackend.Repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SensorsService {
    @Autowired
    public SensorRepository repository;
    @Autowired
    public UserRepository userRepository;

    public Sensor createSensor(SensorCreateDto dto)
    {
        Sensor newSensor=new Sensor();
           if(userRepository.findById(dto.userId).isPresent())
           {
              UserAccount owner= userRepository.findById(dto.userId).get();
               newSensor.ownerId=owner.id;
               newSensor.owner=owner;
               newSensor.highLimit=dto.highLimit;
               newSensor.lowLimit=dto.lowLimit;
               newSensor.name=dto.name;
               newSensor.type=dto.type;
               newSensor=repository.save(newSensor);
               owner.sensors.add(newSensor);
               userRepository.save(owner);


               return  newSensor;

           }
           return null;
    }
    public Sensor getSensor(Long sensorId)
    {
        if(repository.findById(sensorId).isPresent())
              return repository.findById(sensorId).get();
        return null;
    }
    public Sensor updateSensor(SensorUpdateDto data)
    {    if(repository.findById(data.id).isPresent())
    {
        Sensor sensor=repository.findById(data.id).get();
        sensor.name=data.name;
        sensor.lowLimit=data.lowLimit;
        sensor.highLimit=data.highLimit;
        sensor.type= data.type;
        sensor.ownerId=data.userId;
        return  repository.save(sensor);
    }

        return null;
    }
    public boolean deleteSensor(Long sensorId)
    { System.out.println("delete sensor with id"+sensorId);
        if(repository.findById(sensorId).isPresent())
        {
            System.out.println("found sensor"+sensorId);
            Sensor sensor=repository.findById(sensorId).get();
            sensor.owner.sensors.remove(sensor);
            userRepository.save(sensor.owner);

            System.out.println("deleting sensor with name:"+sensor.name);
            repository.deleteById(sensorId);
            System.out.println("deleted"+sensorId);
            return true;
        }

        return false;
    }
    public List<Sensor> getAllSensors() {
        return (List<Sensor>) repository.findAll();

    }


}
