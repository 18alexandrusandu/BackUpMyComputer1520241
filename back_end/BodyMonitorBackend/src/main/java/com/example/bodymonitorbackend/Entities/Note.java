package com.example.bodymonitorbackend.Entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

import java.util.Date;
@Entity
public class Note {
    @jakarta.persistence.Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long Id;
    public Date date;
    public String description;
    public String text;
    @JsonBackReference
    @ManyToOne
    public UserAccount user;


}
