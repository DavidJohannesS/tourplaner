package com.uni.dto;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TourEntryDTO {
    private long id;
    private String comment;
    private String difficulty;
    private String distance;
    private String time;
    private String rating;
    private Date dateTime;
    private String searchVector;
}
