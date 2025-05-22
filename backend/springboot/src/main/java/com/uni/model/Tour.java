package com.uni.model;

import com.uni.model.TourEntry;
import jakarta.persistence.*;
import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import java.lang.String; 
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "tour")
public class Tour
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String description;
    private String fromLocation;
    private String toLocation;
    private String transportType;
    private double distance;
    private int estimatedTime;
    
    @Lob
    @Column(name = "route_image")
    private byte[] routeImage;
    
    @OneToMany(mappedBy = "tour", cascade = CascadeType.ALL)
    private List<TourEntry> tourEntries;
}
