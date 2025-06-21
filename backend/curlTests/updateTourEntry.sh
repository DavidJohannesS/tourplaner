#!/bin/bash
curl -X PUT "http://localhost:8080/api/tour-entries/1" \
     -H "Content-Type: application/json" \
     -d '{
         "comment": "Breathtaking landscape!",
         "difficulty": "Hard",
         "distance": "20",
         "time": "4",
         "rating": "5"
     }'
