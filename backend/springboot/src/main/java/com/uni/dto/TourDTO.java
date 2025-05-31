package com.uni.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.uni.dto.TourEntryDTO;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TourDTO
{
    private long id;
    private String name;
    private String description;
    private String fromLocation;
    private String toLocation;
    private String transportType;
    private String distance;
    private String estimatedTime;
    private List<TourEntryDTO> tourEntries;
}
