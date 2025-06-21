#!/bin/bash
curl -X POST "http://localhost:8080/api/tour-entries" \
     -H "Content-Type: application/json" \
     -d '{
         "comment": "Amazing view!",
         "difficulty": "Medium",
         "distance": "15",
         "time": "3",
         "rating": "5",
         "tourId": 1
     }'
