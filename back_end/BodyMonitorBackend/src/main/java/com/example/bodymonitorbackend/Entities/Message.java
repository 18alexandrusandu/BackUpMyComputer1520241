package com.example.bodymonitorbackend.Entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

import java.util.Date;

@Entity
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public long Id;
    public  String unit;
    public double value;
    public String type;
    public String description;
    public Date timestamp;
    @JsonIgnoreProperties("messages")
    @ManyToOne(fetch = FetchType.EAGER)
     public Sensor sensor;
}
