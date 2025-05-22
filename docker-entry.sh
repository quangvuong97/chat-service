#!/bin/sh

# Chạy NestJS ở nền (BE)
node /app/dist/main.js &

# Chạy FE ở cổng 5000
serve -s /fe -l 5000
