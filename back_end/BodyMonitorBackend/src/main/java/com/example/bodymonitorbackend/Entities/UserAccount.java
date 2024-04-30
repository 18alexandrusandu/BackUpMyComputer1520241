package com.example.bodymonitorbackend.Entities;

import jakarta.persistence.*;

import java.util.Date;
import java.util.List;
@Entity
public class UserAccount {

    @jakarta.persistence.Id

    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;
    public String name;
    public String username;
    public String password;
    public String phone;
    public Date dateOfBirth;
    public String address;
    public Integer fingerId;
    public String email;
    @OneToOne
    public Role role;
    public  String status;
    @OneToMany(cascade = CascadeType.ALL,orphanRemoval = true,
            fetch = FetchType.EAGER, mappedBy = "owner")
    public  List<Sensor> sensors;
    @OneToMany(cascade = CascadeType.ALL,orphanRemoval = true,
            fetch = FetchType.EAGER)
    public  List<Note> notes;
    @OneToMany(cascade = CascadeType.ALL,orphanRemoval = true,
            fetch = FetchType.EAGER)
    public List<Prescription> prescriptions;
    @OneToMany(fetch = FetchType.EAGER)
    public   List<Asignment> asignments;

}
