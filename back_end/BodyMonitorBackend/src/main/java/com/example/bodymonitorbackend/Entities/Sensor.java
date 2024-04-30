package com.example.bodymonitorbackend.Entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Data
public class Sensor {
    public float lowLimit;
    public float highLimit;
    @JsonIgnoreProperties("sensor")
    @OneToMany(fetch = FetchType.EAGER)
    List<Message> messages;
    @ManyToOne
    @JsonBackReference
    @JoinColumn(name="user_account_id")
    public UserAccount owner;
    public Long ownerId;

     public String type;

    public String name;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

}
