#!/bin/bash
curl -X POST http://localhost:8080/api/tours \
     -H "Content-Type: application/json" \
     -d '{
           "name": "Coastal Adventure",
           "description": "Exploring scenic coastal routes.",
           "fromLocation": "San Francisco",
           "toLocation": "Los Angeles",
           "transportType": "Car",
           "distance": "350",
           "estimatedTime": "6",
           "tourEntries": []
         }'
