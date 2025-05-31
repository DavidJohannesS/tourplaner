package com.uni.repo;

import com.uni.model.Tour;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
@Repository
public interface TourRepo extends JpaRepository<Tour, Long>
{


    @Query(value = """
        SELECT * FROM tour 
        WHERE to_tsvector('english', name || ' ' || description || ' ' || from_location || ' ' || to_location) @@ plainto_tsquery(:query)
        """, nativeQuery = true)
    List<Tour> searchTours(@Param("query") String query);
}
