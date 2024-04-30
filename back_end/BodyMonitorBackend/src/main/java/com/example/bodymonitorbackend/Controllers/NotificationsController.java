package com.example.bodymonitorbackend.Controllers;

import com.example.bodymonitorbackend.Entities.Notification;
import com.example.bodymonitorbackend.Services.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*", methods = { RequestMethod.GET,RequestMethod.POST },
        allowedHeaders = "*")
public class NotificationsController {
    @Autowired
    public NotificationService notificationsService;

    @GetMapping("notifications/delete/{id}")
    public void deleteNotification(@PathVariable Long id)
    {
       notificationsService.deleteNotification(id);
    }
    @GetMapping("notifications/user/{id}")
    public List<Notification> getAllNotifications(@PathVariable  Long id)
     {
         System.out.println("notifications for user"+id);

         List<Notification> notifications=notificationsService.findNotificationsForUser(id);
         return  notifications;
     }
    @GetMapping("notifications/{id}")
    public  Notification getNotification(Long Id)
    {
        return null;
    }


}
