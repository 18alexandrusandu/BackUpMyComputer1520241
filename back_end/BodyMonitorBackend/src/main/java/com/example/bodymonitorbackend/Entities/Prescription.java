package com.example.bodymonitorbackend.Entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

import java.util.Date;
@Entity
public class Prescription {

    @jakarta.persistence.Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;
    public Date startDate;
    public Date endDate;
    public String description;
    public String text;
    @JsonBackReference
    @ManyToOne
    public UserAccount user;
}
