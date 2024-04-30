package com.example.bodymonitorbackend.Dtos;

import com.example.bodymonitorbackend.Entities.Message;
import com.example.bodymonitorbackend.Entities.UserAccount;
import jakarta.persistence.*;

import java.util.List;

public class SensorCreateDto {
    public float lowLimit;
    public float highLimit;
    public Long userId;
    public String type;
    public String name;
}
