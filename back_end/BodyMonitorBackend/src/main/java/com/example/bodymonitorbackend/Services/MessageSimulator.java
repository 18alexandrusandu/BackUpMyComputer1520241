package com.example.bodymonitorbackend.Services;

import com.example.bodymonitorbackend.Controllers.SensorsController;
import com.example.bodymonitorbackend.Dtos.MessageDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

@Component
public class MessageSimulator {
    @Autowired MessagesService messagesService;
    @Autowired SensorsController sensorsController;

    @Bean
   void  SendMessages() {
        Thread t = new Thread(new Runnable() {
            @Override public void run() {
              if(false) {
                  for (int i = 0; i < 20; i++) {

                      MessageDto msg = new MessageDto();
                      msg.sensorId = 8;
                      msg.value = (int) (Math.random() * 3) == 1 ? Math.random() * 50 : 150 + Math.random() * 700;
                      msg.unit = "unit";
                      msg.type = Math.random() > 0.5 ? "temperature" : "ecg";
                      sensorsController.sendData(msg);


                      System.out.println("sending notification");
                      try {
                          Thread.sleep(10000);
                      } catch (Exception e) {
                          System.out.println("simulator intrerupted");
                      }
                  }
              }
                }



        });
        t.start();
    }

}
