#!/bin/bash
set -e
cd /srv


exec java -jar target/*.jar
