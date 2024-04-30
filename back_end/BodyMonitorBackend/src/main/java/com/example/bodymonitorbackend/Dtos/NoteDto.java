package com.example.bodymonitorbackend.Dtos;

import com.example.bodymonitorbackend.Entities.UserAccount;
import jakarta.persistence.ManyToOne;

import java.util.Date;

public class NoteDto {
    public Long Id;
    public Long userId;
    public Date date;
    public String description;
    public String text;


}
