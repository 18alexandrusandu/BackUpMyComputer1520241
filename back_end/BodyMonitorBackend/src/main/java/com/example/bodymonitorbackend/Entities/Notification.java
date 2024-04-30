package com.example.bodymonitorbackend.Entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;

import java.util.Date;
@Entity
public class Notification {

    @jakarta.persistence.Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;
    public String text;
    public String title;
    public String source;
    public String sourceType;
    public Date timestamp;
    public String timeDifference;
    public String warningLevel;
    public Long userId;
}
