#!/bin/bash
curl -X GET http://localhost:8080/api/tours
curl -X POST http://localhost:8080/api/tours/1/entries \
     -H "Content-Type: application/json" \
     -d '{
           "comment": "Incredible view of the coast!",
           "difficulty": "Easy",
           "distance": "350",
           "time": "6",
           "rating": "5",
           "dateTime": "2025-06-01T09:00:00"
         }'
