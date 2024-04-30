package com.example.bodymonitorbackend.Services;

import jakarta.annotation.PostConstruct;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;

import java.io.File;

@Component
public class EmailService {
   @Autowired
    private JavaMailSender javaMailSender;

    @Value("${spring.mail.username}") private String from;
    @Value( "${spring.mail.password}")
    public String password;


    String sendMail(String body,String toEmail,String subject)
    {
        try {

            // Creating a simple mail message
            SimpleMailMessage mailMessage =new SimpleMailMessage();

            // Setting up necessary details
            mailMessage.setFrom(from);
            mailMessage.setTo(toEmail);
            mailMessage.setText(body);
            mailMessage.setSubject(subject);

            /// Sending the mail
            javaMailSender.send(mailMessage);
            return "Mail Sent Successfully...";


        }

        // Catch block to handle the exceptions
        catch (Exception e) {
            return null;
        }


    }



   public String  sendComplexMail(String body,String toEmail,String subject,String attachment)
    {
        // Creating a mime message
        MimeMessage mimeMessage
                = javaMailSender.createMimeMessage();
        MimeMessageHelper mimeMessageHelper;

        try {
            mimeMessageHelper
                    = new MimeMessageHelper(mimeMessage, true);
            mimeMessageHelper.setFrom(from);
            mimeMessageHelper.setTo(toEmail);
            mimeMessageHelper.setText(body);
            mimeMessageHelper.setSubject(subject);

            // Adding the attachment
            FileSystemResource file
                    = new FileSystemResource(
                    new File(attachment))
                    ;

            if( file.getFilename()!=null)
              mimeMessageHelper.addAttachment(file.getFilename(), file);

            // Sending the mail
            javaMailSender.send(mimeMessage);
            return "Mail sent Successfully";
        }

        // Catch block to handle MessagingException
        catch (MessagingException e) {

            // Display message when exception occurred
            return "Error while sending mail!!!";
        }
    }
}

