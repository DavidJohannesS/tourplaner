package com.uni.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import java.lang.String; 

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
}
