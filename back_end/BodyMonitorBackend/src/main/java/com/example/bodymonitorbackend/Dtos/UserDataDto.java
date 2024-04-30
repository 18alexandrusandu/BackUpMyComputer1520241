package com.example.bodymonitorbackend.Dtos;

import com.example.bodymonitorbackend.Entities.Sensor;

import java.util.List;

public class UserDataDto {

    public List<SensorDto> sensors;
    public String name;
    public String type;
    public long userId;
}
