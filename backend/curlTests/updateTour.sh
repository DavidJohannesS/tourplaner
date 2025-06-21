#!/bin/bash

curl -X PUT "http://localhost:8080/api/tours/1" \
     -H "Content-Type: application/json" \
     -d '{
         "name": "Updated Tour Name",
         "description": "Updated Description",
         "fromLocation": "Updated Start",
         "toLocation": "Updated End",
         "transportType": "Bike",
         "distance": "200",
         "estimatedTime": "5"
     }'
