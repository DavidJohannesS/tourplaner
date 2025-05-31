package com.uni.repo;

import com.uni.model.Tour;
import com.uni.model.TourEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
@Repository
public interface TourEntryRepository extends JpaRepository<TourEntry, Long>
{
    @Query(value = """
        SELECT * FROM tour_entry 
        WHERE to_tsvector('english', comment || ' ' || difficulty || ' ' || distance || ' ' || time || ' ' || rating) @@ plainto_tsquery(:query)
        """, nativeQuery = true)
    List<TourEntry> searchEntries(@Param("query") String query);

}
