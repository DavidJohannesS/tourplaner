package com.uni.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import java.lang.String; 
import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "tourEntry")
public class TourEntry
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String comment;
    private String difficulty;
    private String distance;
    private String time;
    private String rating;

    @Temporal(TemporalType.TIMESTAMP)
    private Date dateTime;

    @ManyToOne
    @JoinColumn(name = "tour_id")
    private Tour tour;
        @Column(name = "search_vector", columnDefinition = "tsvector")
    @org.hibernate.annotations.ColumnTransformer(
        write = "to_tsvector('english', ?)",
        read = "search_vector"
    )
    private String searchVector;

    @PrePersist
    @PreUpdate
    public void generateSearchVector() {
        this.searchVector = comment + " " + difficulty + " " + distance + " " + time + " " + rating;
    }
}
