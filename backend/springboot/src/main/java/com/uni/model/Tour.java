package com.uni.model;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

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
    private String distance;
    private String estimatedTime;
    
    @Lob
    @Column(name = "route_image")
    private byte[] routeImage;
    
    @OneToMany(mappedBy = "tour", cascade = CascadeType.ALL, fetch=FetchType.EAGER, orphanRemoval = true)
    private List<TourEntry> tourEntries = new ArrayList<>();
}
