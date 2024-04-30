package com.example.bodymonitorbackend.Entities;

import com.fasterxml.jackson.annotation.JsonIdentityReference;
import jakarta.persistence.*;

@Entity
public class Asignment {

    @Id
    @GeneratedValue
    public Long id;

    public Long patientId;
    public  Long asistantId;

    public long priority;
}
