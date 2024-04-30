package com.example.bodymonitorbackend.Controllers;

import com.example.bodymonitorbackend.Dtos.MessageDto;
import com.example.bodymonitorbackend.Dtos.SensorCreateDto;
import com.example.bodymonitorbackend.Dtos.SensorUpdateDto;
import com.example.bodymonitorbackend.Entities.Message;
import com.example.bodymonitorbackend.Entities.Sensor;
import com.example.bodymonitorbackend.Services.MessagesService;
import com.example.bodymonitorbackend.Services.SensorsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@RestController
@CrossOrigin(origins = "*", methods = { RequestMethod.GET,RequestMethod.POST },
        allowedHeaders = "*")
public class SensorsController {
        @Autowired
        MessagesService messagesService;
        @Autowired
        SensorsService sensorsService;
    ;@PostMapping("sensors/send")
   public void sendData(@RequestBody MessageDto data)
    {

        System.out.println("sending data from:"+data.sensorId);
        System.out.println("data  from sensor"+data);
        messagesService.createMessage(data);


    }
    @GetMapping("sensors/measurements")
    public List<Message> getAllMeasurements()
    {
        return messagesService.getAllMessages();
    }

    public List<Message> getMessagesBySensor(@PathVariable  Long id)
    {
        return messagesService.getMessagesBySensor(id);
    }
    @GetMapping("sensors/measurements/sensor/{id}/date/{date}")
    public List<Message> getMessagesBySensorForDate(@PathVariable  Long id,@PathVariable
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    Date date)
    {   System.out.println("date provided to get measurement:"+date.toString());
      List<Message> list=messagesService.getMessagesBySensorForDate(id,date);
       System.out.println("list of messages"+list);

    return list;
    }


    @GetMapping("sensors")
    public List<Sensor> getSensors()
    {
        List<Sensor> sensors=sensorsService.getAllSensors();
        return sensors;
    }
    ;@PostMapping("sensors/create")
    public void createSensor(@RequestBody SensorCreateDto data)
    {
        Sensor created=sensorsService.createSensor(data);
        if(created!=null)
            System.out.println("Sensor created succesfully"+data);
        else
            System.out.println("could nopt create sensor"+data);
    }
    @PostMapping("sensors/update")
    public void updateSensor(@RequestBody SensorUpdateDto data)
    {
        Sensor created=sensorsService.updateSensor(data);
        if(created!=null)
            System.out.println("Sensor update succesfully"+data);
        else
            System.out.println("could nopt update sensor"+data);
    }
    @GetMapping("sensors/delete/{sensorId}")
    public void deleteSensor(@PathVariable Long sensorId)
    {
        sensorsService.deleteSensor(sensorId);

    }

}
