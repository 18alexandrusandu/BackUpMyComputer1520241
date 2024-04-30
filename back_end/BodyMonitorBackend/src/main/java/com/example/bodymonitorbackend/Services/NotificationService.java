package com.example.bodymonitorbackend.Services;

import com.example.bodymonitorbackend.Entities.*;
import com.example.bodymonitorbackend.Repositories.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class NotificationService {
    public final SimpMessagingTemplate template;
    @Autowired
    public NotificationService (SimpMessagingTemplate template) {
        this.template = template;

    }

    @Autowired
    UserRepository userRepository;
    @Autowired
    SensorRepository sensorRepository;
    @Autowired
    NotificationRepository repository;



     public List<Notification> findNotificationsForUser(Long userId)
       {

           return repository.findAllByUserId(userId);
       }





       void notify_user(Long userId, Message message)
        {
          Notification newNotification=new Notification();
          newNotification.source=message.sensor.name;
          newNotification.text="The measurement with value:"+message.value+"is outside of parameters";
          newNotification.timestamp=new Date();
          newNotification.title="Body parameter out of bounce";
          newNotification.userId=userId;
          newNotification.sourceType=message.type;
          newNotification.warningLevel="high";
          newNotification=repository.save(newNotification);
          template.convertAndSend("/topic/note/"+userId,
                    newNotification
                    );
        }
    void notify_assistants(Long userId, Message message)
    {
        if(userRepository.findById(userId).isPresent()) {
            UserAccount user=userRepository.findById(userId).get();
            for(Asignment a : user.asignments) {
                Long assistantId= a.asistantId;
                Notification newNotification=new Notification();
                newNotification.source=message.sensor.name;
                newNotification.text="User: "+user.username+" has The measurement with value"+
                        message.value+" "+message.unit+" outside of limits";
                newNotification.timestamp=new Date();
                newNotification.title="Device parameter out of bounce";
                newNotification.userId= assistantId;
                newNotification.warningLevel="high";
                newNotification.sourceType=message.type;
                newNotification=repository.save(newNotification);
                template.convertAndSend("/topic/note/" + assistantId, newNotification);
            }

        }
    }


    public void deleteNotification(Long id) {
         System.out.println("Delete notification with id+"+id);
         repository.deleteById(id);
    }
}
