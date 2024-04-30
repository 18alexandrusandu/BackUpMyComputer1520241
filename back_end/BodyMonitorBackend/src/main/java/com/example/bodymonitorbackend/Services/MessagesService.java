package com.example.bodymonitorbackend.Services;

import com.example.bodymonitorbackend.Dtos.MessageDto;
import com.example.bodymonitorbackend.Entities.Message;
import com.example.bodymonitorbackend.Entities.Sensor;
import com.example.bodymonitorbackend.Repositories.MessagesRepository;
import com.example.bodymonitorbackend.Repositories.SensorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

@Service
public class MessagesService {
    @Autowired
    public MessagesRepository repository;
    @Autowired
    public SensorRepository sensorRepository;

    @Autowired
    NotificationService notificationService;

      public Message createMessage(MessageDto dto)
      {
      if(sensorRepository.findById(dto.sensorId).isPresent()) {
          System.out.println("sensor exists");
          Sensor sensor = sensorRepository.findById(dto.sensorId).get();
          Message newmsg = new Message();
          newmsg.sensor = sensor;
          newmsg.value = dto.value;
          newmsg.unit = dto.unit;
          newmsg.type = dto.type;
          newmsg.description=dto.description;
          newmsg.timestamp=new Date();
          return saveMessage(newmsg);
      }
      return null;

      }



    boolean checkMessage(Message message)
    {
        if(message.value<message.sensor.lowLimit || message.value>message.sensor.highLimit)
        {
            if(message.value<message.sensor.lowLimit)
               message.type+=" too low";
                else
            if(message.value>message.sensor.highLimit)
                message.type+=" too high";


            notificationService.notify_user(message.sensor.ownerId,message);
            notificationService.notify_assistants(message.sensor.ownerId,message);

            return false;
        }
          return true;
    }
    public List<Message> getAllMessages()
    {
        return (List<Message>)repository.findAll();
    }
    public List<Message> getMessagesBySensor(Long sensorId)
    {
        return (List<Message>)repository.findAllBySensorId(sensorId);
    }
    public List<Message> getMessagesBySensorForDate(Long sensorId,Date date){
       Date date1=new Date(),date2=new Date();
        DateFormat format=new SimpleDateFormat("dd/MM/yy");
        try {
            var data=date.toInstant();
            //strip date by time information
            date1=format.parse(format.format(date));
            //create a calendar object ot easily add time interval
            Calendar cal=Calendar.getInstance();
            //give the date from date1 to calendar object
            cal.setTime(date1);
            //add the interval of data representing a full day
            cal.add(Calendar.HOUR_OF_DAY,23);
            cal.add(Calendar.MINUTE,59);
            cal.add(Calendar.SECOND,59);
            //set date2 to the date found in calendar
            date2=cal.getTime();
            System.out.println(date1.toString());
            System.out.println(date2.toString());

           // Scanner scanner = new Scanner(System.in);
            //scanner.nextLine();
            return (List<Message>)repository.findAllBySensorIdAndTimestampBetween(sensorId,date1,date2);

        } catch (ParseException e) {
            throw new RuntimeException(e);
        }



    }

    public Message saveMessage(Message message)
    {
        checkMessage(message);
        Message Msg= repository.save(message);
        Msg.sensor.getMessages().add(Msg);
        sensorRepository.save( Msg.sensor);
        return  Msg;
    }


}
