package com.ez.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    // dunglh15@gmail.com
    @Value("spring.mail.username")
    private String fromEmail;

    // send email:
    public void sendEmail(String subject, String body, List<String> recipients ){

        SimpleMailMessage message = new SimpleMailMessage();

        // sender email
        message.setFrom(fromEmail);
        // receiver emails
        message.setTo(recipients.toArray(new String[0]));
        // subject
        message.setSubject(subject);
        // body
        message.setText(body);

        // send email
        mailSender.send(message);
    }

}
